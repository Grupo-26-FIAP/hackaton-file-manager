import { ProducerQueueService } from '@Infrastructure/queues/producer/provider.service';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { QueuesEnum } from '@Shared/enums/queues.enum';
import { Queue } from 'bullmq';

jest.mock('bullmq', () => {
  return {
    Queue: jest.fn().mockImplementation(() => ({
      add: jest.fn().mockResolvedValue({ id: 'mock-job-id' }),
    })),
  };
});

describe('ProducerQueueService', () => {
  let service: ProducerQueueService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'REDIS_HOST') return 'localhost';
      if (key === 'REDIS_PORT') return 6379;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducerQueueService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<ProducerQueueService>(ProducerQueueService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getQueue', () => {
    it('should return a Queue instance', async () => {
      await service.getQueue(QueuesEnum.FILES_TO_PROCESS);
      expect(Queue).toHaveBeenCalledWith(QueuesEnum.FILES_TO_PROCESS, {
        connection: { host: 'localhost', port: 6379 },
      });
    });
  });

  describe('addToQueue', () => {
    it('should call queue.add with correct params and return job id', async () => {
      const result = await service.addToQueue({
        job: { foo: 'bar' },
        jobName: 'test-job',
        queueName: QueuesEnum.FILES_TO_PROCESS,
      });

      expect(result).toBe('mock-job-id');

      const queueInstance = (Queue as unknown as jest.Mock).mock.results[0]
        .value;
      expect(queueInstance.add).toHaveBeenCalledWith('test-job', {
        foo: 'bar',
      });
    });
  });
});
