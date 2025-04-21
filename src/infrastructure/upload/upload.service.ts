import { DataToUploadQueueInterface } from '@Infrastructure/queues/interfaces/data-to-upload.queue.interface';
import { Injectable } from '@nestjs/common';
import { UploadFoldersEnum } from './enums/folders.enum';
import { S3Service } from './s3.service';

@Injectable()
export class UploadService {
  constructor(private readonly s3Service: S3Service) {}

  async uploadFiles(data: DataToUploadQueueInterface): Promise<string[]> {
    const filesUploadedKeys: string[] = [];

    for (const element of data.filesToUpload) {
      try {
        const key = await this.s3Service.uploadFile({
          folder: UploadFoldersEnum.RAW_FILES,
          file: {
            name: element.originalname,
            buffer: Buffer.from(element.buffer),
            mimeType: element.mimetype,
          },
        });

        filesUploadedKeys.push(key);
      } catch (error) {
        throw new Error(
          `Failed to upload file: ${element.originalname}. Error: ${error}`,
        );
      }
    }

    return filesUploadedKeys;
  }
}
