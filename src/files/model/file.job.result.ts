import { FileJobDescription } from './file.job.description.enum.js';
import { FileResource } from './file.resource.entity.js';
import { FileRow } from './file.row.entity.js';
import { FileStatus } from './file.status.enum.js';

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
