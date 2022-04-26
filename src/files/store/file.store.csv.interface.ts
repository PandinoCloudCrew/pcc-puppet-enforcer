import { FileResource } from '../model/file.resource.entity.js';
import { FileRow } from '../model/file.row.entity.js';
import { FileStoreMetadata } from './file.store.metadata.entity.js';

export interface IFileStoreCsv {
  open(fileResource: FileResource);
  append(row: FileRow);
  flush(fileResource: FileResource): FileStoreMetadata;
}
