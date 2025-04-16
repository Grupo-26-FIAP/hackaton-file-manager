export interface DataToProcessQueueInterface {
  name: string;
  toProcess: Express.Multer.File[];
}
