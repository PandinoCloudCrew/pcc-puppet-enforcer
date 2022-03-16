import { FileRowType } from '../format/file.row.type.enum.js';

export class FileRowValue {
  index: number;
  name: string;
  source: string;
  value: string | number | Date;
  type: FileRowType;
  constructor(values: Partial<FileRowValue>) {
    if (values) {
      Object.assign(this, values);
    }
  }
}
