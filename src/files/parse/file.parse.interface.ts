import { FileRow } from '../model/file.row.entity';
import { FileResource } from '../model/file.resource.entity';
import { FileFormatHash } from '../format/file.format.hash';

export interface IFileParse {
  readContents(
    fileFormatHash: FileFormatHash,
    fileResource: FileResource,
  ): AsyncIterableIterator<FileRow>;
}
