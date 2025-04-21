import { UploadFilesConsumerService } from '@Infrastructure/queues/consumer/upload-files.consumer.service';
import { DataToUploadQueueInterface } from '@Infrastructure/queues/interfaces/data-to-upload.queue.interface';
import { InterserviceProducerQueueService } from '@Infrastructure/queues/producer/interservice-provider.service';
import { UploadService } from '@Infrastructure/upload/upload.service';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Job } from 'bullmq';

jest.mock('bullmq', () => ({
  Worker: jest.fn(),
}));

describe('UploadFilesConsumerService', () => {
  let service: UploadFilesConsumerService;
  const jobData: Job<DataToUploadQueueInterface> = {
    data: {
      userId: 'test-user-id',
      filesToUpload: [],
    },
  } as Job<DataToUploadQueueInterface>;

  const mockConfigService = { get: jest.fn() };

  const mockUploadService = { uploadFiles: jest.fn() };

  const mockProducerQueueService = {
    sendUploadedFilesToProcessQueue: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadFilesConsumerService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: UploadService,
          useValue: mockUploadService,
        },
        {
          provide: InterserviceProducerQueueService,
          useValue: mockProducerQueueService,
        },
      ],
    }).compile();

    service = module.get<UploadFilesConsumerService>(
      UploadFilesConsumerService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('process', () => {
    it('should call uploadFiles and sendUploadedFilesToProcessQueue', async () => {
      const filesUploadedKeys = ['file1', 'file2'];
      mockUploadService.uploadFiles.mockResolvedValue(filesUploadedKeys);

      await service['process'](jobData);

      expect(mockUploadService.uploadFiles).toHaveBeenCalledTimes(1);
      expect(mockUploadService.uploadFiles).toHaveBeenCalledWith(jobData.data);
      expect(
        mockProducerQueueService.sendUploadedFilesToProcessQueue,
      ).toHaveBeenCalledWith({
        userId: jobData.data.userId,
        filesUploadedKeys,
      });
    });
  });
});
