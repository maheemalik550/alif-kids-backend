import type { File } from 'multer';
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
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  async uploadImage(@UploadedFile() file: File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file type
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed',
      );
    }

    return this.fileUploadService.uploadFile(file, 'anf-app/images');
  }

  @Post('video')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  async uploadVideo(@UploadedFile() file: File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file type
    const allowedMimes = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only MP4, WebM, and QuickTime are allowed',
      );
    }

    return this.fileUploadService.uploadFile(file, 'anf-app/videos');
  }

  @Post('audio')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  async uploadAudio(@UploadedFile() file: File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file type
    const allowedMimes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4'];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only MP3, WAV, OGG, and M4A are allowed',
      );
    }

    return this.fileUploadService.uploadFile(file, 'anf-app/audio');
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10))
  @HttpCode(HttpStatus.OK)
  async uploadMultiple(@UploadedFiles() files: File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    return this.fileUploadService.uploadMultipleFiles(
      files,
      'anf-app/multiple',
    );
  }

  @Post('activity-image')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  async uploadActivityImage(@UploadedFile() file: File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid image file type');
    }

    return this.fileUploadService.uploadFile(file, 'anf-app/activities');
  }

  @Post('series-image')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  async uploadSeriesImage(@UploadedFile() file: File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid image file type');
    }

    return this.fileUploadService.uploadFile(file, 'anf-app/series');
  }

  @Post('episode-image')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  async uploadEpisodeImage(@UploadedFile() file: File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid image file type');
    }

    return this.fileUploadService.uploadFile(file, 'anf-app/episodes');
  }
}
