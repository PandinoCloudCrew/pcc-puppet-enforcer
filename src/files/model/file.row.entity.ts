import { FileRowValue } from './file.row.value';

export class FileRow {
  id: string;
  index: number;
  values: Record<string, FileRowValue> = {};
}
