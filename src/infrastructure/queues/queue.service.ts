import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QueuesEnum } from '@Shared/enums/queues.enum';
import { Queue, RedisOptions } from 'bullmq';
import { DataToProcessQueueInterface } from './interfaces/data-to-process.queue.interface';

@Injectable()
export class QueueService {
  private readonly connection: RedisOptions;

  constructor(private readonly configService: ConfigService) {
    this.connection = {
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
    };
  }

  async getQueue(queueName: QueuesEnum): Promise<Queue> {
    return new Queue(queueName, { connection: this.connection });
  }

  async addToQueue(data: {
    job: DataToProcessQueueInterface;
    queueName: QueuesEnum;
  }): Promise<string> {
    const { queueName, job } = data;

    const queue = await this.getQueue(queueName);

    const jobAdded = await queue.add(job.name, job);
    return jobAdded.id;
  }
}
