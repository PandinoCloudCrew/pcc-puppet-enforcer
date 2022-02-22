import { FileFormatMap } from './file.format.map';
import { FileResource } from '../model/file.resource.entity';

export class FileFormatHash {
  fileFormatMap: Array<FileFormatMap>;
  indexOrderMap: Record<number, FileFormatMap> = {};

  constructor(fileResource: FileResource) {
    this.fileFormatMap = fileResource.columnFormat;
    for (const column of this.fileFormatMap) {
      this.indexOrderMap[column.index] = column;
      fileResource.columnName[column.name] = column.index;
    }
  }

  getByIndex = (columnPosition: number): FileFormatMap =>
    this.indexOrderMap[columnPosition];
}
