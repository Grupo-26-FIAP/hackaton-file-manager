import { Injectable } from '@nestjs/common';
import { QueuesEnum } from '@Shared/enums/queues.enum';
import { SqsService } from '@ssut/nestjs-sqs';
import { randomUUID } from 'crypto';
import { DataToProcessQueueInterface } from '../interfaces/data-to-process.queue.interface';

@Injectable()
export class InterserviceProducerQueueService {
  constructor(private readonly sqsService: SqsService) {}

  async sendUploadedFilesToProcessQueue(
    data: DataToProcessQueueInterface,
  ): Promise<void> {
    await this.sendMessage<DataToProcessQueueInterface>({
      queueName: QueuesEnum.FILES_TO_PROCESS,
      queueBody: data,
    });
  }

  private async sendMessage<T>(data: {
    queueName: string;
    queueBody: T;
  }): Promise<void> {
    const { queueName, queueBody } = data;
    const [queueId, groupId] = [randomUUID(), randomUUID()];

    try {
      await this.sqsService.send(queueName, {
        id: queueId,
        groupId: groupId,
        body: queueBody,
        delaySeconds: 0,
        deduplicationId: queueId,
      });
    } catch (error) {
      throw new Error(`Error sending message to SQS: ${error}`);
    }
  }
}
