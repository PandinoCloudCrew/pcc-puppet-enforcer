import { Body, Controller, Logger, Post } from '@nestjs/common';
import { FileIteratorService } from './file.iterator.service.js';
import { FileJobResult } from './model/file.job.result.js';
import { FileResource } from './model/file.resource.entity.js';

@Controller('/file')
export class FileIteratorController {
  private readonly logger = new Logger(FileIteratorController.name);

  constructor(private readonly fileIteratorService: FileIteratorService) {}

  @Post()
  requestFileProcessing(
    @Body() fileResource: FileResource,
  ): Promise<FileJobResult> {
    const job = new FileResource(fileResource);
    this.logger.log(`processing file: ${typeof job.columnName}`);
    return this.fileIteratorService.processFile(job);
  }
}
