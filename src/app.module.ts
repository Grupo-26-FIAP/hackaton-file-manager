import { FileUploadQueue } from '@Infrastructure/queues/file-upload.queue.service';
import { QueueService } from '@Infrastructure/queues/queue.service';
import { S3Service } from '@Infrastructure/upload/s3.service';
import { UploadService } from '@Infrastructure/upload/upload.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileService } from '@Services/file.service';
import { FileController } from './controllers/file.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [FileController],
  providers: [
    S3Service,
    FileService,
    QueueService,
    UploadService,
    ConfigService,
    FileUploadQueue,
  ],
})
export class AppModule {}
