import { IFileParse } from './file.parse.interface';
import { FileFormatHash } from '../format/file.format.hash';
import { FileResource } from '../model/file.resource.entity';
import { FileRow } from '../model/file.row.entity';
import { Logger } from '@nestjs/common';

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
