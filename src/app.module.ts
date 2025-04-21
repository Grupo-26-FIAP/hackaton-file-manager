import { UploadFilesConsumerService } from '@Infrastructure/queues/consumer/upload-files.consumer.service';
import { InterserviceProducerQueueService } from '@Infrastructure/queues/producer/interservice-provider.service';
import { ProducerQueueService } from '@Infrastructure/queues/producer/provider.service';
import { S3Service } from '@Infrastructure/upload/s3.service';
import { UploadService } from '@Infrastructure/upload/upload.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { FileService } from '@Services/file.service';
import { QueuesEnum } from '@Shared/enums/queues.enum';
import { SqsModule } from '@ssut/nestjs-sqs';
import * as AWS from 'aws-sdk';
import { config } from 'dotenv';
import { FileController } from './controllers/file.controller';

config();

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    SqsModule.register({
      producers: [
        {
          name: QueuesEnum.FILES_TO_PROCESS,
          queueUrl: process.env.SQS_FILES_TO_PROCESS_URL,
          region: process.env.AWS_REGION,
        },
      ],
    }),
  ],
  controllers: [FileController],
  providers: [
    S3Service,
    FileService,
    UploadService,
    ConfigService,
    ProducerQueueService,
    UploadFilesConsumerService,
    InterserviceProducerQueueService,
  ],
})
export class AppModule {}
