import { Controller, Get, Logger } from '@nestjs/common';
import { FileIteratorService } from './file.iterator.service';
import { FileResource } from './model/file.resource.entity';
import { FileJobResult } from './model/file.job.result';
import { randomUUID } from 'crypto';
import { FileStatus } from './model/file.status.enum';
import { FileStorage } from './model/file.storage.enum';
import { FileFormatMap } from './format/file.format.map';
import { FileRowType } from './format/file.row.type.enum';
import { FileType } from './model/file.type.enum';

@Controller('/file')
export class FileIteratorController {
  private readonly logger = new Logger(FileIteratorController.name);

  constructor(private readonly fileIteratorService: FileIteratorService) {}

  @Get()
  getHello(): Promise<FileJobResult> {
    const fileResource = new FileResource({
      id: randomUUID(),
      status: FileStatus.CREATED,
      columnSeparator: ',',
      storageType: FileStorage.LOCAL,
      fileType: FileType.CSV,
      remotePath: '/Users/josebocanegra/pandino/test-users.csv',
      columnFormat: FileIteratorController.fileColumnFormats(),
    });
    this.logger.log(`processing file: ${JSON.stringify(fileResource)}`);
    return this.fileIteratorService.processFile(fileResource);
  }

  private static fileColumnFormats(): Array<FileFormatMap> {
    return [
      new FileFormatMap({
        index: 0,
        name: 'usuario',
        type: FileRowType.TEXT,
      }),
      new FileFormatMap({
        index: 1,
        name: 'edad',
        type: FileRowType.NUMBER,
      }),
      new FileFormatMap({
        index: 2,
        name: 'creado',
        type: FileRowType.DATE,
      }),
    ];
  }
}
