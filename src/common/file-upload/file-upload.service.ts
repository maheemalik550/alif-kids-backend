import { Injectable, BadRequestException } from '@nestjs/common';
import type { File } from 'multer';
import { uploadOnCloudinary } from '../helpers/cloudinary';

export interface UploadResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

@Injectable()
export class FileUploadService {
  async uploadFile(
    file: File,
    folder: string = 'anf-app',
  ): Promise<UploadResponse> {
    try {
      if (!file) {
        throw new BadRequestException('No file provided');
      }

      const result = await uploadOnCloudinary(file.path);

      if (!result) {
        throw new BadRequestException('File upload to Cloudinary failed');
      }

      return {
        success: true,
        message: 'File uploaded successfully',
        data: {
          url: result.secure_url || result.url,
          publicId: result.public_id,
          format: result.format,
          size: result.bytes,
          width: result.width,
          height: result.height,
        },
      };
    } catch (error) {
      console.error('File upload error:', error);
      return {
        success: false,
        error: error.message || 'File upload failed',
      };
    }
  }

  async uploadMultipleFiles(
    files: File[],
    folder: string = 'anf-app',
  ): Promise<UploadResponse> {
    try {
      if (!files || files.length === 0) {
        throw new BadRequestException('No files provided');
      }

      const uploadPromises = files.map((file) => uploadOnCloudinary(file.path));
      const results = await Promise.all(uploadPromises);

      const successfulUploads = results.filter((r) => r !== null);

      if (successfulUploads.length === 0) {
        throw new BadRequestException('All file uploads failed');
      }

      return {
        success: true,
        message: `${successfulUploads.length} file(s) uploaded successfully`,
        data: successfulUploads.map((result) => ({
          url: result.secure_url || result.url,
          publicId: result.public_id,
          format: result.format,
          size: result.bytes,
          width: result.width,
          height: result.height,
        })),
      };
    } catch (error) {
      console.error('Multiple file upload error:', error);
      return {
        success: false,
        error: error.message || 'Multiple file upload failed',
      };
    }
  }
}
