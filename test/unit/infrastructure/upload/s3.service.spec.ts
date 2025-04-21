import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { FileToUploadInterface } from '@Infrastructure/upload/interfaces/file-to-upload.interface';
import { S3Service } from '@Infrastructure/upload/s3.service';
import { mockClient } from 'aws-sdk-client-mock';

const s3Mock = mockClient(S3Client);

describe('S3Service', () => {
  let service: S3Service;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config = {
        AWS_REGION: 'us-east-1',
        AWS_ACCESS_KEY_ID: 'mock-access-key-id',
        AWS_SECRET_ACCESS_KEY: 'mock-secret-access-key',
        AWS_S3_BUCKET: 'mock-bucket',
      };
      return config[key];
    }),
  };

  beforeEach(() => {
    s3Mock.reset();

    service = new S3Service(mockConfigService as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadFile', () => {
    it('should upload a file and return the S3 URL', async () => {
      const mockFile: FileToUploadInterface = {
        name: 'example.txt',
        buffer: Buffer.from('Hello world'),
        mimeType: 'text/plain',
      };

      s3Mock.on(PutObjectCommand).resolves({});

      const result = await service.uploadFile({
        folder: 'test-folder',
        file: mockFile,
      });

      expect(result).toMatch(
        /^https:\/\/mock-bucket\.s3\.amazonaws\.com\/test-folder\/.+-example\.txt$/,
      );

      expect(s3Mock.calls()[0].args[0].input).toMatchObject({
        Bucket: 'mock-bucket',
        ContentType: 'text/plain',
      });
    });

    it('should throw an error if upload fails', async () => {
      const mockFile: FileToUploadInterface = {
        name: 'fail.txt',
        buffer: Buffer.from('Fail upload'),
        mimeType: 'text/plain',
      };

      s3Mock.on(PutObjectCommand).rejects(new Error('Upload failed'));

      await expect(
        service.uploadFile({ folder: 'fail-folder', file: mockFile }),
      ).rejects.toThrow('Failed to upload file to S3');
    });
  });
});
