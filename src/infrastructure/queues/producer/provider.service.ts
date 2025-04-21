import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QueuesEnum } from '@Shared/enums/queues.enum';
import { Queue, RedisOptions } from 'bullmq';

@Injectable()
export class ProducerQueueService {
  private readonly redisConnection: RedisOptions;

  constructor(private readonly configService: ConfigService) {
    this.redisConnection = {
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
    };
  }

  async getQueue(queueName: QueuesEnum): Promise<Queue> {
    return new Queue(queueName, { connection: this.redisConnection });
  }

  async addToQueue<T>(data: {
    job: T;
    jobName: string;
    queueName: QueuesEnum;
  }): Promise<string> {
    const { queueName, jobName, job } = data;

    const queue = await this.getQueue(queueName);

    const jobAdded = await queue.add(jobName, job);
    return jobAdded.id;
  }
}
