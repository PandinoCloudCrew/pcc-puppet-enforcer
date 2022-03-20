import { Body, Controller, Post } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { FileIteratorService } from './file.iterator.service.js';
import { FileJobResult } from './model/file.job.result.js';
import { FileResource } from './model/file.resource.entity.js';

@Controller('/file')
export class FileIteratorController {
  constructor(
    @InjectPinoLogger(FileIteratorController.name)
    private readonly logger: PinoLogger,
    private readonly fileIteratorService: FileIteratorService,
  ) {}

  @Post()
  requestFileProcessing(
    @Body() fileResource: FileResource,
  ): Promise<FileJobResult> {
    const job = new FileResource(fileResource);
    this.logger.info(`processing file: ${typeof job.columnName}`);
    return this.fileIteratorService.processFile(job);
  }
}
