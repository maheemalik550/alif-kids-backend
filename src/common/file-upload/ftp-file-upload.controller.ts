import type { File } from 'multer'
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
  UseGuards,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { FtpFileUploadService } from './ftp-file-upload.service'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'

@Controller('ftp-upload')
@UseGuards(JwtAuthGuard)
export class FtpFileUploadController {
  constructor(private readonly ftpFileUploadService: FtpFileUploadService) {}

  @Post('book')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  async uploadBook(@UploadedFile() file: File) {
    if (!file) {
      throw new BadRequestException('No file provided')
    }

    // Validate file type for ebooks (pdf, epub, mobi)
    const allowedMimes = [
      'application/pdf',
      'application/epub+zip',
      'application/x-mobipocket-ebook',
    ]
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only PDF, EPUB, and MOBI are allowed',
      )
    }

    return this.ftpFileUploadService.uploadBook(file)
  }

  @Post('video')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  async uploadVideo(
    @UploadedFile() file: File,
    @Body('videoName') videoName?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided')
    }

    // Validate file type
    const allowedMimes = ['video/mp4', 'video/webm', 'video/quicktime']
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only MP4, WebM, and QuickTime are allowed',
      )
    }

    return this.ftpFileUploadService.uploadVideo(file, videoName)
  }

  @Post('books/multiple')
  @UseInterceptors(FilesInterceptor('files', 10))
  @HttpCode(HttpStatus.OK)
  async uploadMultipleBooks(@UploadedFiles() files: File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided')
    }

    // Validate file types
    const allowedMimes = [
      'application/pdf',
      'application/epub+zip',
      'application/x-mobipocket-ebook',
    ]
    const invalidFiles = files.filter(
      (file) => !allowedMimes.includes(file.mimetype),
    )
    if (invalidFiles.length > 0) {
      throw new BadRequestException(
        'Invalid file type found. Only PDF, EPUB, and MOBI are allowed',
      )
    }

    return this.ftpFileUploadService.uploadMultipleBooks(files)
  }


  @Post('audio')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  async uploadAudio(
    @UploadedFile() file: File,
    @Body('audioName') audioName?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided')
    }

    const allowedMimes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4']
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only MP3, WAV, OGG, and M4A are allowed',
      )
    }

    return this.ftpFileUploadService.uploadAudio(file, audioName)
  }

  @Post('videos/multiple')
  @UseInterceptors(FilesInterceptor('files', 10))
  @HttpCode(HttpStatus.OK)
  async uploadMultipleVideos(@UploadedFiles() files: File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided')
    }

    // Validate file types
    const allowedMimes = ['video/mp4', 'video/webm', 'video/quicktime']
    const invalidFiles = files.filter(
      (file) => !allowedMimes.includes(file.mimetype),
    )
    if (invalidFiles.length > 0) {
      throw new BadRequestException(
        'Invalid file type found. Only MP4, WebM, and QuickTime are allowed',
      )
    }

    return this.ftpFileUploadService.uploadMultipleVideos(files)
  }

  @Post('multiple-fields')
  @UseInterceptors(FilesInterceptor('files', 20))
  @HttpCode(HttpStatus.OK)
  async uploadMultipleFields(@UploadedFiles() files: File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided')
    }

    // Group files by field name if needed
    const filesByField: { [key: string]: File[] } = {}
    files.forEach((file) => {
      const fieldName = (file as any).fieldname || 'files'
      if (!filesByField[fieldName]) {
        filesByField[fieldName] = []
      }
      filesByField[fieldName].push(file)
    })

    return this.ftpFileUploadService.uploadMultipleFields(filesByField)
  }

  @Post('picture')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  async uploadPicture(@UploadedFile() file: File) {
    if (!file) {
      throw new BadRequestException('No file provided')
    }

    // Validate file type for images
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/jpg',
    ]
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed',
      )
    }

    return this.ftpFileUploadService.uploadPicture(file)
  }

  @Post('pictures/multiple')
  @UseInterceptors(FilesInterceptor('files', 20))
  @HttpCode(HttpStatus.OK)
  async uploadMultiplePictures(@UploadedFiles() files: File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided')
    }

    // Validate file types
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/jpg',
    ]
    const invalidFiles = files.filter(
      (file) => !allowedMimes.includes(file.mimetype),
    )
    if (invalidFiles.length > 0) {
      throw new BadRequestException(
        'Invalid file type found. Only JPEG, PNG, GIF, and WebP are allowed',
      )
    }

    return this.ftpFileUploadService.uploadMultiplePictures(files)
  }

  @Post('printable')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  async uploadPrintable(@UploadedFile() file: File) {
    if (!file) {
      throw new BadRequestException('No file provided')
    }

    // Validate file type for printables (PDF only)
    const allowedMimes = ['application/pdf']
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only PDF is allowed for printables',
      )
    }

    return this.ftpFileUploadService.uploadPrintable(file)
  }

  @Post('printables/multiple')
  @UseInterceptors(FilesInterceptor('files', 10))
  @HttpCode(HttpStatus.OK)
  async uploadMultiplePrintables(@UploadedFiles() files: File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided')
    }

    // Validate file types
    const allowedMimes = ['application/pdf']
    const invalidFiles = files.filter(
      (file) => !allowedMimes.includes(file.mimetype),
    )
    if (invalidFiles.length > 0) {
      throw new BadRequestException(
        'Invalid file type found. Only PDF is allowed for printables',
      )
    }

    return this.ftpFileUploadService.uploadMultiplePrintables(files)
  }
}
