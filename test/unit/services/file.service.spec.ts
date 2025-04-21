import { ProducerQueueService } from '@Infrastructure/queues/producer/provider.service';
import {
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from '@Services/file.service';
import { QueuesEnum } from '@Shared/enums/queues.enum';

describe('FileService', () => {
  let service: FileService;

  const mockProducerQueueService = {
    addToQueue: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileService,
        {
          provide: ProducerQueueService,
          useValue: mockProducerQueueService,
        },
      ],
    }).compile();

    service = module.get<FileService>(FileService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadFiles', () => {
    it('should throw UnauthorizedException if userId is not provided', async () => {
      await expect(service.uploadFiles('', [])).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnprocessableEntityException if files are not provided', async () => {
      await expect(service.uploadFiles('userId', [])).rejects.toThrow(
        UnprocessableEntityException,
      );
    });

    it('should call addToQueue with correct parameters', async () => {
      const userId = 'userId';
      const files = [
        {
          originalname: 'file1.txt',
          buffer: Buffer.from('file1 content'),
          mimetype: 'text/plain',
        },
      ] as Express.Multer.File[];

      await service.uploadFiles(userId, files);

      expect(mockProducerQueueService.addToQueue).toHaveBeenCalledTimes(1);
      expect(mockProducerQueueService.addToQueue).toHaveBeenCalledWith({
        job: { userId, filesToUpload: files },
        jobName: expect.any(String),
        queueName: QueuesEnum.FILES_TO_UPLOAD,
      });
    });
  });
});
