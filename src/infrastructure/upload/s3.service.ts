import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { FileToUploadInterface } from './interfaces/file-to-upload.interface';

@Injectable()
export class S3Service {
  private readonly s3: S3Client;
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });

    this.bucket = this.configService.get<string>('AWS_S3_BUCKET');
  }

  async uploadFile(data: {
    folder: string;
    file: FileToUploadInterface;
  }): Promise<string> {
    const { folder, file } = data;

    const key = `${folder}/${randomUUID()}-${file.name}`;
    const params: PutObjectCommandInput = {
      Bucket: this.bucket,
      Key: key,
      Body: Buffer.from(file.buffer),
      ContentType: file.mimeType,
    };

    try {
      await this.s3.send(new PutObjectCommand(params));

      return `https://${this.bucket}.s3.amazonaws.com/${key}`;
    } catch (error) {
      throw new Error(`Failed to upload file to S3. Error: ${error.message}`);
    }
  }
}
