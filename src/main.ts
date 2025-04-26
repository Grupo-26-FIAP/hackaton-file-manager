import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function start(): Promise<void> {
  const application: INestApplication = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  application.setGlobalPrefix('file-manager');

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('File Manager API')
    .setDescription('API de gestão de arquivos')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(application, config);
  SwaggerModule.setup('docs', application, document);

  await application.listen(process.env.PORT ?? 3003);
}

void start();
