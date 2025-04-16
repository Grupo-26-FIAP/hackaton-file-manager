import { multerConfig } from '@Infrastructure/upload/multer.config';
import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { FileService } from '@Services/file.service';
import { MAX_FILES_PER_REQUEST } from '@Shared/constants/files.constant';

@ApiTags('File')
@Controller('/file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', MAX_FILES_PER_REQUEST, multerConfig),
  )
  async uploadFile(@UploadedFiles() files: Express.Multer.File[]) {
    await this.fileService.upload(files);
  }
}
