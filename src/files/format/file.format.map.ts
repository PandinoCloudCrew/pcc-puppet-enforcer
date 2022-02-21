import { FileRowType } from './file.row.type.enum';

export class FileFormatMap {
  index: number;
  name: string;
  length: number;
  type: FileRowType;

  constructor(values: Partial<FileFormatMap>) {
    if (values) {
      Object.assign(this, values);
    }
  }

  apply(value: string): string | number | Date {
    switch (this.type) {
      case FileRowType.TEXT:
        return value;
      case FileRowType.DATE:
        return new Date(value);
      case FileRowType.NUMBER:
        return Number(value);
      default:
        return value;
    }
  }
}
