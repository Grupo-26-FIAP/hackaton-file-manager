import { UploadService } from '@Infrastructure/upload/upload.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QueuesEnum } from '@Shared/enums/queues.enum';
import { Job, Worker } from 'bullmq';
import { RedisOptions } from 'ioredis';
import { DataToUploadQueueInterface } from '../interfaces/data-to-upload.queue.interface';
import { InterserviceProducerQueueService } from '../producer/interservice-provider.service';

@Injectable()
export class UploadFilesConsumerService {
  private readonly worker: Worker;
  private readonly connection: RedisOptions;

  constructor(
    private readonly configService: ConfigService,
    private readonly uploadService: UploadService,
    private readonly producerQueueService: InterserviceProducerQueueService,
  ) {
    this.connection = {
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
    };

    this.worker = new Worker(
      QueuesEnum.FILES_TO_UPLOAD,
      async (job) => this.process(job),
      { connection: this.connection },
    );
  }

  private async process(job: Job<DataToUploadQueueInterface>): Promise<void> {
    const filesUploadedKeys: string[] = await this.uploadService.uploadFiles(
      job.data,
    );

    await this.producerQueueService.sendUploadedFilesToProcessQueue({
      userId: job.data.userId,
      filesUploadedKeys,
    });
  }
}
