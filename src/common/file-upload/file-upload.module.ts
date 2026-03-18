import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { FtpFileUploadService } from './ftp-file-upload.service';
import { FtpFileUploadController } from './ftp-file-upload.controller';

@Module({
  providers: [FileUploadService, FtpFileUploadService],
  controllers: [FileUploadController, FtpFileUploadController],
  exports: [FileUploadService, FtpFileUploadService],
})
export class FileUploadModule {}
