import { IsNumber, IsString } from 'class-validator';
import { FileRowValue } from './file.row.value.js';

export class FileRow {
  @IsString()
  id: string;
  @IsNumber()
  index: number;
  columns = 0;
  values: Record<string, FileRowValue> = {};
}
