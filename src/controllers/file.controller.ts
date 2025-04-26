import { multerConfig } from '@Infrastructure/upload/multer.config';
import {
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileService } from '@Services/file.service';
import { MAX_FILES_PER_REQUEST } from '@Shared/constants/files.constant';
import { GetCurrentUserId } from '@Shared/decorators/get-user-id.decorator';

@ApiTags('File')
@Controller('/file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data') // Indica que o endpoint aceita arquivos
  @ApiBody({
    description: 'Upload de arquivos',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary', // Indica que é um arquivo
          },
        },
      },
    },
  })
  
  @UseInterceptors(
    FilesInterceptor('files', MAX_FILES_PER_REQUEST, multerConfig),
  )
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @GetCurrentUserId() userId: string,
  ): Promise<void> {
    await this.fileService.uploadFiles(userId, files);
  }

  @Get('/')
  async get(): Promise<string> {
    return 'it works!';
  }
}
