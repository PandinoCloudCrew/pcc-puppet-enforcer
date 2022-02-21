import { FileType } from '../model/file.type.enum';
import { Injectable } from '@nestjs/common';
import { IFileParse } from './file.parse.interface';
import { FileParseCsvService } from './file.parse.csv.service';
import { FileParseNoopService } from './file.parse.noop.service';

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
