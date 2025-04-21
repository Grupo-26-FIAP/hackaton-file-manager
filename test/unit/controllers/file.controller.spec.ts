import { FileController } from '@Controllers/file.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from '@Services/file.service';

describe('FileController', () => {
  let controller: FileController;

  const mockFileService = { uploadFiles: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [
        {
          provide: FileService,
          useValue: mockFileService,
        },
      ],
    }).compile();

    controller = module.get<FileController>(FileController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadFiles', () => {
    it('should upload files successfully', async () => {
      const files = [];

      await controller.uploadFiles(files, 'userId');
      expect(mockFileService.uploadFiles).toHaveBeenCalledTimes(1);
      expect(mockFileService.uploadFiles).toHaveBeenCalledWith('userId', files);
    });
  });
});
