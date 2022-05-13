import { Logger } from '@nestjs/common';
import { FileFormatHash } from '../format/file.format.hash.js';
import { FileResource } from '../model/file.resource.entity.js';
import { FileRow } from '../model/file.row.entity.js';
import { IFileParse } from './file.parse.interface.js';

export class FileParseNoopService implements IFileParse {
  private readonly logger = new Logger(FileParseNoopService.name);

  async *readContents(
    fileFormatHash: FileFormatHash,
    fileResource: FileResource,
  ): AsyncIterableIterator<FileRow> {
    this.logger.debug(
      `No action required for file: ${fileResource.localPath}, returning ${fileResource.lines} rows.`,
    );
    for (let idx = 0; idx < fileResource.lines; idx++) {
      const mockRow = new FileRow();
      mockRow.index = idx;
      yield mockRow;
    }
  }
}
