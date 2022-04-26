import { nanoid } from 'nanoid';
import { FileResource } from '../model/file.resource.entity.js';
import { FileRow } from '../model/file.row.entity.js';
import { IFileStoreCsv } from './file.store.csv.interface.js';
import { FileStoreMetadata } from './file.store.metadata.entity.js';

export class S3FileStoreCsv implements IFileStoreCsv {
  append(row: FileRow) {}

  flush(fileResource: FileResource): FileStoreMetadata {
    return new FileStoreMetadata({
      id: nanoid(),
      name: fileResource.name,
    });
  }

  open(fileResource: FileResource) {}
}
