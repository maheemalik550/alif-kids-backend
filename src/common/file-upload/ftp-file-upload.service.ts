import { Injectable, BadRequestException } from '@nestjs/common'
import { uploadFile, uploadFilesStream, multipleFieldsFileUploadStream } from '../../utils/fileUpload'
import * as path from 'path'
import * as fs from 'fs'

interface FTPConfig {
  host: string
  user: string
  password: string
  port?: number
}

export interface UploadResponse {
  success: boolean
  message?: string
  data?: any
  error?: string
  url?: string
}

@Injectable()
export class FtpFileUploadService {
  private ftpConfig: FTPConfig
  private ftpRemotePath: string
  private ftpBaseUrl: string

  constructor() {
    // Get FTP configuration from environment variables
    this.ftpConfig = {
      host: (process.env.FTP_HOST || '').trim(),
      user: (process.env.FTP_USER || '').trim(),
      password: (process.env.FTP_PASSWORD || '').trim(),
      port: process.env.FTP_PORT ? parseInt(process.env.FTP_PORT) : 21,
    }

    // Set FTP remote path for uploaded files
    // Example: /uploads/pictures or /public/media/pictures
    this.ftpRemotePath = (process.env.FTP_REMOTE_PATH || 'media.abdullahandfatima.com/public_html/').trim()

    // Ensure remote path ends with /
    if (!this.ftpRemotePath.endsWith('/')) {
      this.ftpRemotePath += '/'
    }

    // Set FTP base URL for accessing uploaded files
    // Example: https://media.myschooljourney.app
    this.ftpBaseUrl = (process.env.FTP_BASE_URL).trim()

    // Remove trailing slash from base URL
    if (this.ftpBaseUrl.endsWith('/')) {
      this.ftpBaseUrl = this.ftpBaseUrl.slice(0, -1)
    }

    console.log(`FTP Remote Path: ${this.ftpRemotePath}`)
    console.log(`FTP Base URL: ${this.ftpBaseUrl}`)

    // Validate configuration on service initialization
    if (!this.ftpConfig.host || !this.ftpConfig.user || !this.ftpConfig.password) {
      console.error('FTP Configuration Error:', {
        host: this.ftpConfig.host ? 'set' : 'missing',
        user: this.ftpConfig.user ? 'set' : 'missing',
        password: this.ftpConfig.password ? 'set' : 'missing',
      })
    }
  }

  /**
   * Get remote FTP path for specific upload type
   * @param type - Upload type: 'pictures', 'videos', 'books', etc.
   * @returns Full remote path with type subdirectory
   */
  private getRemotePathForType(type: 'pictures' | 'videos' | 'books' | 'printables' | 'audio' | 'default' = 'default'): string {
    if (type === 'default') {
      return this.ftpRemotePath
    }
    
    let typePath = this.ftpRemotePath
    if (!typePath.endsWith('/')) {
      typePath += '/'
    }
    return `${typePath}${type}/`
  }

  /**
   * Generate full URL for uploaded file with type subdirectory
   * @param filename - The uploaded filename
   * @param type - Upload type: 'pictures', 'videos', 'books', etc.
   * @returns Full accessible URL
   */
  private getFullUrl(filename: string, type: 'pictures' | 'videos' | 'books' | 'printables' | 'audio' | 'default' = 'default'): string {
    if (type === 'default') {
      return `${this.ftpBaseUrl}/${filename}`
    }
    
    return `${this.ftpBaseUrl}/${type}/${filename}`
  }

  /**
   * Get the file buffer from multer file object
   * Handles multiple storage types: disk path, destination+filename, and memory buffer
   */
  private getFileBuffer(file: any): Buffer {
    console.log('File object properties:', {
      hasPath: !!file.path,
      hasDestination: !!file.destination,
      hasFilename: !!file.filename,
      hasBuffer: !!file.buffer,
      keys: Object.keys(file),
    })

    // Handle memory storage (buffer) - already in memory
    if (file.buffer && Buffer.isBuffer(file.buffer)) {
      console.log(`File buffer ready for upload: ${file.originalname}`)
      return file.buffer
    }

    // For disk storage, read file into buffer
    if (file.path && fs.existsSync(file.path)) {
      console.log(`Reading file from disk: ${file.path}`)
      const fileBuffer = fs.readFileSync(file.path)
      // Clean up after reading
      try {
        fs.unlinkSync(file.path)
        console.log(`Temporary file deleted: ${file.path}`)
      } catch (deleteErr) {
        console.error('Failed to delete temporary file:', deleteErr)
      }
      return fileBuffer
    }

    // Try destination + filename
    if (file.destination && file.filename) {
      const fullPath = path.join(file.destination, file.filename)
      if (fs.existsSync(fullPath)) {
        console.log(`Reading file from: ${fullPath}`)
        const fileBuffer = fs.readFileSync(fullPath)
        // Clean up after reading
        try {
          fs.unlinkSync(fullPath)
          console.log(`Temporary file deleted: ${fullPath}`)
        } catch (deleteErr) {
          console.error('Failed to delete temporary file:', deleteErr)
        }
        return fileBuffer
      }
    }

    throw new BadRequestException(
      `File buffer could not be extracted. Available properties: ${Object.keys(file).join(', ')}`
    )
  }

  /**
   * Get the full file path from multer file object
   * Handles multiple storage types: disk path, destination+filename, and memory buffer
   * Creates temp files only for FTP upload (temp files are cleaned after upload)
   */
  private getFilePath(file: any): string {
    console.log('File object properties:', {
      hasPath: !!file.path,
      hasDestination: !!file.destination,
      hasFilename: !!file.filename,
      hasBuffer: !!file.buffer,
      keys: Object.keys(file),
    })

    // Try path property first (disk storage)
    if (file.path) {
      return file.path
    }

    // Try destination + filename (disk storage with routing)
    if (file.destination && file.filename) {
      return path.join(file.destination, file.filename)
    }

    // Handle memory storage (buffer) - create temp file for FTP upload
    if (file.buffer && Buffer.isBuffer(file.buffer)) {
      // Create temp file in Node's temp directory
      const tempFilePath = path.join(require('os').tmpdir(), `upload-${Date.now()}-${file.originalname}`)
      
      console.log(`Writing buffer to temporary file: ${tempFilePath}`)
      fs.writeFileSync(tempFilePath, file.buffer)
      console.log(`Temporary file created: ${tempFilePath}`)
      
      return tempFilePath
    }

    throw new BadRequestException(
      `File path could not be determined. Available properties: ${Object.keys(file).join(', ')}`
    )
  }

  async uploadBook(file: any): Promise<UploadResponse> {
    try {
      if (!file) {
        throw new BadRequestException('No file provided')
      }

      const fileBuffer = this.getFileBuffer(file)
      const remotePath = this.getRemotePathForType('books')
      const fileName = await uploadFile(
        fileBuffer,
        file.originalname,
        'book',
        this.ftpConfig,
        remotePath,
      )

      return {
        success: true,
        message: 'Book uploaded successfully',
        data: {
          filename: fileName,
          originalName: file.originalname,
          size: file.size,
          url: this.getFullUrl(fileName, 'books'),
        },
      }
    } catch (error) {
      console.error('Book upload error:', error)
      return {
        success: false,
        error: error.message || 'Book upload failed',
      }
    }
  }

  async uploadVideo(file: any, videoName?: string): Promise<UploadResponse> {
    try {
      if (!file) {
        throw new BadRequestException('No file provided')
      }

      const fileBuffer = this.getFileBuffer(file)
      const remotePath = this.getRemotePathForType('videos')
      const fileName = await uploadFile(
        fileBuffer,
        videoName || file.originalname,
        'video',
        this.ftpConfig,
        remotePath,
      )

      return {
        success: true,
        message: 'Video uploaded successfully',
        data: {
          filename: fileName,
          originalName: file.originalname,
          size: file.size,
          url: this.getFullUrl(fileName, 'videos'),
        },
      }
    } catch (error) {
      console.error('Video upload error:', error)
      return {
        success: false,
        error: error.message || 'Video upload failed',
      }
    }
  }


  async uploadAudio(file: any, audioName?: string): Promise<UploadResponse> {
    try {
      if (!file) {
        throw new BadRequestException('No file provided')
      }

      const fileBuffer = this.getFileBuffer(file)
      const remotePath = this.getRemotePathForType('audio')
      const fileName = await uploadFile(
        fileBuffer,
        audioName || file.originalname,
        'audio',
        this.ftpConfig,
        remotePath,
      )

      return {
        success: true,
        message: 'Audio uploaded successfully',
        data: {
          filename: fileName,
          originalName: file.originalname,
          size: file.size,
          url: this.getFullUrl(fileName, 'audio'),
        },
      }
    } catch (error) {
      console.error('Audio upload error:', error)
      return {
        success: false,
        error: error.message || 'Audio upload failed',
      }
    }
  }

  async uploadMultipleBooks(files: any[]): Promise<UploadResponse> {
    try {
      if (!files || files.length === 0) {
        throw new BadRequestException('No files provided')
      }

      const fileBuffers = files.map((file) => ({
        fileName: file.originalname,
        buffer: this.getFileBuffer(file),
      }))

      const remotePath = this.getRemotePathForType('books')
      const uploadedFiles = await uploadFilesStream(fileBuffers, this.ftpConfig, remotePath)

      return {
        success: true,
        message: `${uploadedFiles.length} book(s) uploaded successfully`,
        data: uploadedFiles.map((filename) => ({
          filename,
          url: this.getFullUrl(filename, 'books'),
        })),
      }
    } catch (error) {
      console.error('Multiple books upload error:', error)
      return {
        success: false,
        error: error.message || 'Multiple books upload failed',
      }
    }
  }

  async uploadMultipleVideos(files: any[]): Promise<UploadResponse> {
    try {
      if (!files || files.length === 0) {
        throw new BadRequestException('No files provided')
      }

      const fileBuffers = files.map((file) => ({
        fileName: file.originalname,
        buffer: this.getFileBuffer(file),
      }))

      const remotePath = this.getRemotePathForType('videos')
      const uploadedFiles = await uploadFilesStream(fileBuffers, this.ftpConfig, remotePath)

      return {
        success: true,
        message: `${uploadedFiles.length} video(s) uploaded successfully`,
        data: uploadedFiles.map((filename) => ({
          filename,
          url: this.getFullUrl(filename, 'videos'),
        })),
      }
    } catch (error) {
      console.error('Multiple videos upload error:', error)
      return {
        success: false,
        error: error.message || 'Multiple videos upload failed',
      }
    }
  }

  async uploadMultipleFields(files: any): Promise<UploadResponse> {
    try {
      if (!files || Object.keys(files).length === 0) {
        throw new BadRequestException('No files provided')
      }

      const fileBuffersWithFields: { [key: string]: Array<{ fileName: string; buffer: Buffer }> } = {}
      
      for (const fieldName in files) {
        fileBuffersWithFields[fieldName] = files[fieldName].map((file: any) => ({
          fileName: file.originalname,
          buffer: this.getFileBuffer(file),
        }))
      }

      // For multiple fields, use the field name as the type for path/URL construction
      // If fieldName is 'pictures', 'videos', etc., use that; otherwise use 'default'
      const uploadedFilesWithUrls: { [key: string]: any[] } = {}
      
      for (const fieldName in fileBuffersWithFields) {
        const remotePath = this.getRemotePathForType(
          fieldName as 'pictures' | 'videos' | 'books' | 'printables' | 'default'
        )
        const uploadedFiles = await multipleFieldsFileUploadStream(
          { [fieldName]: fileBuffersWithFields[fieldName] },
          this.ftpConfig,
          remotePath,
        )

        // Generate URLs with type prefix
        uploadedFilesWithUrls[fieldName] = uploadedFiles[fieldName].map((file: any) => ({
          ...file,
          url: this.getFullUrl(
            file.filename,
            fieldName as 'pictures' | 'videos' | 'books' | 'printables' | 'default'
          ),
        }))
      }

      return {
        success: true,
        message: 'Files uploaded successfully',
        data: uploadedFilesWithUrls,
      }
    } catch (error) {
      console.error('Multiple fields upload error:', error)
      return {
        success: false,
        error: error.message || 'Multiple fields upload failed',
      }
    }
  }

  async uploadPicture(file: any): Promise<UploadResponse> {
    try {
      if (!file) {
        throw new BadRequestException('No file provided')
      }

      const fileBuffer = this.getFileBuffer(file)
      console.log("File buffer ready for picture upload:", file.originalname);

      const remotePath = this.getRemotePathForType('pictures')
      const uploadedFiles = await uploadFilesStream(
        [{ fileName: file.originalname, buffer: fileBuffer }],
        this.ftpConfig,
        remotePath
      )

      const fullUrl = this.getFullUrl(uploadedFiles[0], 'pictures')

      return {
        success: true,
        message: 'Picture uploaded successfully',
        url: fullUrl,
        data: {
          filename: uploadedFiles[0],
          originalName: file.originalname,
          size: file.size,
          url: fullUrl,
        },
      }
    } catch (error) {
      console.error('Picture upload error:', error)
      return {
        success: false,
        error: error.message || 'Picture upload failed',
      }
    }
  }

  async uploadMultiplePictures(files: any[]): Promise<UploadResponse> {
    try {
      if (!files || files.length === 0) {
        throw new BadRequestException('No files provided')
      }

      const fileBuffers = files.map((file) => ({
        fileName: file.originalname,
        buffer: this.getFileBuffer(file),
      }))

      const remotePath = this.getRemotePathForType('pictures')
      const uploadedFiles = await uploadFilesStream(fileBuffers, this.ftpConfig, remotePath)

      return {
        success: true,
        message: `${uploadedFiles.length} picture(s) uploaded successfully`,
        data: uploadedFiles.map((filename) => ({
          filename,
          url: this.getFullUrl(filename, 'pictures'),
        })),
      }
    } catch (error) {
      console.error('Multiple pictures upload error:', error)
      return {
        success: false,
        error: error.message || 'Multiple pictures upload failed',
      }
    }
  }

  async uploadPrintable(file: any): Promise<UploadResponse> {
    try {
      if (!file) {
        throw new BadRequestException('No file provided')
      }

      const fileBuffer = this.getFileBuffer(file)
      const remotePath = this.getRemotePathForType('printables')
      const fileName = await uploadFile(
        fileBuffer,
        file.originalname,
        'printable',
        this.ftpConfig,
        remotePath,
      )

      return {
        success: true,
        message: 'Printable uploaded successfully',
        data: {
          filename: fileName,
          originalName: file.originalname,
          size: file.size,
          url: this.getFullUrl(fileName, 'printables'),
        },
      }
    } catch (error) {
      console.error('Printable upload error:', error)
      return {
        success: false,
        error: error.message || 'Printable upload failed',
      }
    }
  }

  async uploadMultiplePrintables(files: any[]): Promise<UploadResponse> {
    try {
      if (!files || files.length === 0) {
        throw new BadRequestException('No files provided')
      }

      const fileBuffers = files.map((file) => ({
        fileName: file.originalname,
        buffer: this.getFileBuffer(file),
      }))

      const remotePath = this.getRemotePathForType('printables')
      const uploadedFiles = await uploadFilesStream(fileBuffers, this.ftpConfig, remotePath)

      return {
        success: true,
        message: `${uploadedFiles.length} printable(s) uploaded successfully`,
        data: uploadedFiles.map((filename) => ({
          filename,
          url: this.getFullUrl(filename, 'printables'),
        })),
      }
    } catch (error) {
      console.error('Multiple printables upload error:', error)
      return {
        success: false,
        error: error.message || 'Multiple printables upload failed',
      }
    }
  }
}
