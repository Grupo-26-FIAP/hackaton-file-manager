import { Injectable } from '@nestjs/common';
import { QueuesEnum } from '@Shared/enums/queues.enum';
import { Queue, RedisOptions } from 'bullmq';

@Injectable()
export class QueueService {
  private readonly connection: RedisOptions;

  constructor() {
    this.connection = {
      host: 'localhost',
      port: 6379,
    };
  }

  async getQueue(queueName: QueuesEnum): Promise<Queue> {
    return new Queue(queueName, { connection: this.connection });
  }

  async addToQueue(data: {
    job: { name: string; toProcess: any };
    queueName: QueuesEnum;
  }): Promise<string> {
    const { queueName, job } = data;

    const queue = await this.getQueue(queueName);

    const jobAdded = await queue.add(job.name, job.toProcess);
    return jobAdded.id;
  }
}
