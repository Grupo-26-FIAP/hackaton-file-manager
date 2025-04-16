import { FileUploadQueue } from '@Infrastructure/queues/process/file-upload.queue.service';
import { QueueService } from '@Infrastructure/queues/queue.service';
import { Module } from '@nestjs/common';
import { FileService } from '@Services/file.service';
import { FileController } from './controllers/file.controller';

@Module({
  imports: [],
  controllers: [FileController],
  providers: [FileService, QueueService, FileUploadQueue],
})
export class AppModule {}
