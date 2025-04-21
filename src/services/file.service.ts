import { DataToUploadQueueInterface } from '@Infrastructure/queues/interfaces/data-to-upload.queue.interface';
import { ProducerQueueService } from '@Infrastructure/queues/producer/provider.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { QueuesEnum } from '@Shared/enums/queues.enum';

@Injectable()
export class FileService {
  constructor(private readonly queueService: ProducerQueueService) {}

  async uploadFiles(
    userId: string,
    files: Express.Multer.File[],
  ): Promise<void> {
    if (!userId) {
      throw new UnauthorizedException();
    }

    const jobName = `${new Date().toISOString()}:${userId}`;

    await this.queueService.addToQueue<DataToUploadQueueInterface>({
      job: { userId, filesToUpload: files },
      jobName: jobName,
      queueName: QueuesEnum.FILES_TO_UPLOAD,
    });
  }
}
