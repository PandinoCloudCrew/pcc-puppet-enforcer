import { Injectable } from '@nestjs/common';
import { FileType } from '../model/file.type.enum.js';
import { FileParseCsvService } from './file.parse.csv.service.js';
import { IFileParse } from './file.parse.interface.js';
import { FileParseNoopService } from './file.parse.noop.service.js';

@Injectable()
export class FileParseProvider {
  getFormatParser(type: FileType): IFileParse {
    switch (type) {
      case FileType.CSV:
        return new FileParseCsvService();
      default:
        return new FileParseNoopService();
    }
  }
}
