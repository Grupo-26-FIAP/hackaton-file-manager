import { DataToUploadQueueInterface } from '@Infrastructure/queues/interfaces/data-to-upload.queue.interface';
import { UploadFoldersEnum } from '@Infrastructure/upload/enums/folders.enum';
import { S3Service } from '@Infrastructure/upload/s3.service';
import { UploadService } from '@Infrastructure/upload/upload.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('UploadService', () => {
  let service: UploadService;

  const mockS3Service = {
    uploadFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        {
          provide: S3Service,
          useValue: mockS3Service,
        },
      ],
    }).compile();

    service = module.get<UploadService>(UploadService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should upload all files and return their keys', async () => {
    const mockData: DataToUploadQueueInterface = {
      filesToUpload: [
        {
          originalname: 'file1.txt',
          buffer: Buffer.from('file1 content'),
          mimetype: 'text/plain',
        },
        {
          originalname: 'file2.txt',
          buffer: Buffer.from('file2 content'),
          mimetype: 'text/plain',
        },
      ],
    } as DataToUploadQueueInterface;

    mockS3Service.uploadFile
      .mockResolvedValueOnce('s3-url-1')
      .mockResolvedValueOnce('s3-url-2');

    const result = await service.uploadFiles(mockData);

    expect(mockS3Service.uploadFile).toHaveBeenCalledTimes(2);
    expect(mockS3Service.uploadFile).toHaveBeenCalledWith({
      folder: UploadFoldersEnum.RAW_FILES,
      file: {
        name: 'file1.txt',
        buffer: expect.any(Buffer),
        mimeType: 'text/plain',
      },
    });

    expect(result).toEqual(['s3-url-1', 's3-url-2']);
  });

  it('should throw an error if upload of any file fails', async () => {
    const mockData: DataToUploadQueueInterface = {
      filesToUpload: [
        {
          originalname: 'file1.txt',
          buffer: Buffer.from('file1 content'),
          mimetype: 'text/plain',
        },
      ],
    } as DataToUploadQueueInterface;

    mockS3Service.uploadFile.mockRejectedValue(new Error('Upload failed'));

    await expect(service.uploadFiles(mockData)).rejects.toThrow(
      'Failed to upload file: file1.txt. Error: Error: Upload failed',
    );

    expect(mockS3Service.uploadFile).toHaveBeenCalledTimes(1);
  });
});
