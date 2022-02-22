import { FileRowValue } from './file.row.value';
import { IsNumber, IsString } from 'class-validator';

export class FileRow {
  @IsString()
  id: string;
  @IsNumber()
  index: number;
  columns = 0;
  values: Record<string, FileRowValue> = {};
}
