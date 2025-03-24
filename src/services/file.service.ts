import { QueueService } from '@Infrastructure/queues/queue.service';
import { Injectable } from '@nestjs/common';
import { QueuesEnum } from '@Shared/enums/queues.enum';

@Injectable()
export class FileService {
  constructor(private readonly queueService: QueueService) {}

  async upload(files: Express.Multer.File[]): Promise<void> {
    await this.queueService.addToQueue({
      job: {
        name: new Date().toISOString(),
        toProcess: files,
      },
      queueName: QueuesEnum.FILE_UPLOAD,
    });
  }
}
