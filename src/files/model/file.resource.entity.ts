import { FileType } from './file.type.enum';
import { FileStatus } from './file.status.enum';
import { FileStorage } from './file.storage.enum';
import { FileFormatMap } from '../format/file.format.map';

export class FileResource {
  id: string;
  name: string;
  size = 0;
  storageType: FileStorage;
  localPath: string;
  remotePath: string;
  fileType: FileType;
  lines = 0;
  status: FileStatus;
  columnFormat: Array<FileFormatMap> = [];
  columnName: Set<string> = new Set<string>();
  columnSeparator: string;

  constructor(values: Partial<FileResource>) {
    if (values) {
      Object.assign(this, values);
    }
  }
}
