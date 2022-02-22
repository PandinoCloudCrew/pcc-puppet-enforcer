import { IFileParse } from './file.parse.interface';
import { FileFormatHash } from '../format/file.format.hash';
import { FileResource } from '../model/file.resource.entity';
import { FileRow } from '../model/file.row.entity';
import * as fs from 'fs';
import * as readline from 'readline';
import { FileRowValue } from '../model/file.row.value';
import { randomUUID } from 'crypto';

export class FileParseCsvService implements IFileParse {
  async *readContents(
    fileFormatHash: FileFormatHash,
    fileResource: FileResource,
  ): AsyncIterableIterator<FileRow> {
    const rl = readline.createInterface({
      input: fs.createReadStream(fileResource.localPath),
      output: process.stdout,
      terminal: false,
    });

    for await (const line of rl) {
      fileResource.lines++;
      const fileRow = new FileRow();
      fileRow.id = randomUUID();
      fileRow.index = fileResource.lines;
      const columns = line.split(fileResource.columnSeparator);
      for (const [index, column] of columns.entries()) {
        const columnFormat = fileFormatHash.getByIndex(Number(index));
        fileRow.columns++;
        fileRow.values[columnFormat.name] = new FileRowValue({
          index: Number(index),
          source: column,
          value: columnFormat.apply(column),
          type: columnFormat.type,
          name: columnFormat.name,
        });
      }
      yield fileRow;
    }
  }
}
