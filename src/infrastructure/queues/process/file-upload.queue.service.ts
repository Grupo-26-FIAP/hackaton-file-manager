import { Injectable } from '@nestjs/common';
import { QueuesEnum } from '@Shared/enums/queues.enum';
import { Job, Worker } from 'bullmq';
import { RedisOptions } from 'ioredis';

@Injectable()
export class FileUploadQueue {
  private readonly connection: RedisOptions;
  private readonly worker: Worker;

  constructor() {
    this.connection = { host: 'localhost', port: 6379 };

    this.worker = new Worker(QueuesEnum.FILE_UPLOAD, this.process, {
      connection: this.connection,
    });
  }

  private async process(job: Job): Promise<void> {
    // TODO: Upload S3
    console.log({ job: job.data });
  }
}
