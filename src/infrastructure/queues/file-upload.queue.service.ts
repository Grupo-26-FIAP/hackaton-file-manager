import { UploadService } from '@Infrastructure/upload/upload.service';
import { Injectable } from '@nestjs/common';
import { QueuesEnum } from '@Shared/enums/queues.enum';
import { Job, Worker } from 'bullmq';
import { RedisOptions } from 'ioredis';
import { DataToProcessQueueInterface } from './interfaces/data-to-process.queue.interface';

@Injectable()
export class FileUploadQueue {
  private readonly connection: RedisOptions;
  private readonly worker: Worker;

  constructor(private readonly uploadService: UploadService) {
    this.connection = { host: 'localhost', port: 6379 };

    this.worker = new Worker(
      QueuesEnum.FILE_UPLOAD,
      async (job) => this.process(job),
      { connection: this.connection },
    );
  }

  private async process(job: Job<DataToProcessQueueInterface>): Promise<void> {
    const filesUploadedKeys: string[] = await this.uploadService.uploadFiles(
      job.data,
    );

    // TODO: Send to SQS
    console.log({ filesUploaded: filesUploadedKeys });
  }
}
