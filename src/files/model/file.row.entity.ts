import { FileRowValue } from './file.row.value';

export class FileRow {
  id: string;
  index: number;
  values: Map<string, FileRowValue> = new Map<string, FileRowValue>();
}
