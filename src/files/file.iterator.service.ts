import { FileLocatorProvider } from './locate/file.locator.provider';
import { Injectable, Logger } from '@nestjs/common';
import { FileResource } from './model/file.resource.entity';
import { FileJobResult } from './model/file.job.result';
import { FileStatus } from './model/file.status.enum';
import { FileJobDescription } from './model/file.job.description.enum';
import { randomUUID } from 'crypto';
import { FileParseProvider } from './parse/file.parse.provider';
import { FileFormatHash } from './format/file.format.hash';

@Injectable()
export class FileIteratorService {
  private readonly logger = new Logger(FileIteratorService.name);

  constructor(
    private fileLocatorProvider: FileLocatorProvider,
    private fileParseProvider: FileParseProvider,
  ) {}

  async processFile(fileResource: FileResource): Promise<FileJobResult> {
    const fileJob = new FileJobResult({
      id: randomUUID(),
      fileResource: fileResource,
      status: FileStatus.CREATED,
      description: FileJobDescription.PENDING,
      createDate: new Date(),
    });

    const fileLocator = this.fileLocatorProvider.getLocator(
      fileResource.storageType,
    );
    const downloaded = await fileLocator.downloadBytes(fileResource);
    if (!downloaded) {
      fileJob.status = FileStatus.FAILED;
      fileJob.description = FileJobDescription.FILE_NOT_FOUND;
      fileJob.updateDate = new Date();
      return fileJob;
    }

    const formatParser = this.fileParseProvider.getFormatParser(
      fileResource.fileType,
    );
    const columnFormatHash = new FileFormatHash(fileResource);
    const fileRows = formatParser.readContents(columnFormatHash, fileResource);

    for await (const row of fileRows) {
      fileJob.rows.push(row);
      this.logger.verbose(`Processed row: ${JSON.stringify(row)}`);
    }
    fileJob.status = FileStatus.PROCESSED;
    fileJob.description = FileJobDescription.FINISHED;
    return fileJob;
  }
}
