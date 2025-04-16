import { DataToProcessQueueInterface } from '@Infrastructure/queues/interfaces/data-to-process.queue.interface';
import { Injectable } from '@nestjs/common';
import { UploadFoldersEnum } from './enums/folders.enum';
import { S3Service } from './s3.service';

@Injectable()
export class UploadService {
  constructor(private readonly s3Service: S3Service) {}

  async uploadFiles(data: DataToProcessQueueInterface): Promise<string[]> {
    const filesUploadedKeys: string[] = [];

    for (const element of data.toProcess) {
      const key = await this.s3Service.uploadFile({
        folder: UploadFoldersEnum.RAW_FILES,
        file: {
          name: element.originalname,
          buffer: Buffer.from(element.buffer),
          mimeType: element.mimetype,
        },
      });

      filesUploadedKeys.push(key);
    }

    return filesUploadedKeys;
  }
}
