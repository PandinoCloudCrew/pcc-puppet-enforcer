export class FileStoreMetadata {
  id: string;
  name: string;
  status: string;
  contentPath: string;
  bytes: number;
  rowCount: number;
  createDate: Date;
  processingDate: Date;

  constructor(values: Partial<FileStoreMetadata>) {
    if (values) {
      Object.assign(this, values);
    }
  }
}
