export interface DataToUploadQueueInterface {
  userId: string;
  filesToUpload: Express.Multer.File[];
}
