import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function start(): Promise<void> {
  const application: INestApplication = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  await application.listen(process.env.PORT ?? 3000);
}

void start();
