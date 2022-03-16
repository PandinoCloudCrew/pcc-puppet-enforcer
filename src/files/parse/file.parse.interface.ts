import { FileFormatHash } from '../format/file.format.hash.js';
import { FileResource } from '../model/file.resource.entity.js';
import { FileRow } from '../model/file.row.entity.js';

export interface IFileParse {
  readContents(
    fileFormatHash: FileFormatHash,
    fileResource: FileResource,
  ): AsyncIterableIterator<FileRow>;
}
