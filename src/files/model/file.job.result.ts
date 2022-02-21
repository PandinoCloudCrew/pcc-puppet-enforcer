import { FileResource } from './file.resource.entity';
import { FileStatus } from './file.status.enum';
import { FileJobDescription } from './file.job.description.enum';
import { FileRow } from './file.row.entity';

export class FileJobResult {
  id: string;
  fileResource: FileResource;
  status: FileStatus;
  description: FileJobDescription;
  createDate: Date;
  updateDate: Date;
  rows: Array<FileRow> = [];
  constructor(values: Partial<FileJobResult>) {
    if (values) {
      Object.assign(this, values);
    }
  }
}
