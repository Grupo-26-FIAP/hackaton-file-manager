import { MAX_FILE_SIZE } from '@Shared/constants/files.constant';

export const multerConfig = {
  limits: { fileSize: MAX_FILE_SIZE },
};
