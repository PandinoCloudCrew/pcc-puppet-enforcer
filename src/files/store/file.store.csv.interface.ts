import { FileResource } from '../model/file.resource.entity.js';
import { FileRow } from '../model/file.row.entity.js';
import { FileStoreMetadata } from './file.store.metadata.entity.js';

//TODO Complete this implementation
export interface IFileStoreCsv {
  open(fileResource: FileResource): unknown;

  append(row: FileRow): unknown;

  flush(fileResource: FileResource): FileStoreMetadata;
}
