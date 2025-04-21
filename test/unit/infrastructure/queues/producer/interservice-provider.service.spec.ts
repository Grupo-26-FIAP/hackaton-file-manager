import { InterserviceProducerQueueService } from '@Infrastructure/queues/producer/interservice-provider.service';
import { Test, TestingModule } from '@nestjs/testing';
import { QueuesEnum } from '@Shared/enums/queues.enum';
import { SqsService } from '@ssut/nestjs-sqs';

describe('InterserviceProducerQueueService', () => {
  let service: InterserviceProducerQueueService;

  const mockSqsService = { send: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InterserviceProducerQueueService,
        {
          provide: SqsService,
          useValue: mockSqsService,
        },
      ],
    }).compile();

    service = module.get<InterserviceProducerQueueService>(
      InterserviceProducerQueueService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendUploadedFilesToProcessQueue', () => {
    it('should call sendMessage function', async () => {
      const mockSendMessage = jest
        .spyOn(service as any, 'sendMessage')
        .mockResolvedValueOnce(undefined);

      await service.sendUploadedFilesToProcessQueue({} as any);

      expect(mockSendMessage).toHaveBeenCalledTimes(1);
      expect(mockSendMessage).toHaveBeenCalledWith({
        queueName: QueuesEnum.FILES_TO_PROCESS,
        queueBody: {},
      });
    });
  });

  describe('sendMessage', () => {
    it('should call send function', async () => {
      const data = { queueName: 'testQueue', queueBody: {} };

      await service['sendMessage'](data);

      expect(mockSqsService.send).toHaveBeenCalledTimes(1);
      expect(mockSqsService.send).toHaveBeenCalledWith(data.queueName, {
        id: expect.any(String),
        groupId: expect.any(String),
        body: data.queueBody,
        delaySeconds: 0,
        deduplicationId: expect.any(String),
      });
    });
  });
});
