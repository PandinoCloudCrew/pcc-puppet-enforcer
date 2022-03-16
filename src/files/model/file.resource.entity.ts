import {
  IsArray,
  IsDefined,
  IsEnum,
  IsNumber,
  IsString,
} from '@nestjs/class-validator';
import { FileFormatMap } from '../format/file.format.map.js';
import { FileStatus } from './file.status.enum.js';
import { FileStorage } from './file.storage.enum.js';
import { FileType } from './file.type.enum.js';

export class FileResource {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsNumber()
  size = 0;

  @IsEnum(FileStorage)
  @IsDefined()
  storageType: FileStorage;

  @IsString()
  localPath: string;

  @IsString()
  @IsDefined()
  remotePath: string;

  @IsEnum(FileType)
  fileType: FileType;

  @IsNumber()
  lines = 0;

  @IsEnum(FileStatus)
  status: FileStatus;

  @IsArray()
  columnFormat: Array<FileFormatMap> = new Array<FileFormatMap>();

  columnName: Record<string, number> = {};

  columnSeparator: string;

  constructor(values: Partial<FileResource>) {
    if (values) {
      Object.assign(this, values);
    }
    if (!this.columnName) this.columnName = {};
    if (!this.columnFormat) this.columnFormat = new Array<FileFormatMap>();
    else
      this.columnFormat = this.columnFormat.map(
        (value) => new FileFormatMap(value),
      );
  }
}
