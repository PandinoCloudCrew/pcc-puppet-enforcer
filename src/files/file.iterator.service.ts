import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { FileFormatHash } from './format/file.format.hash.js';
import { FileLocatorProvider } from './locate/file.locator.provider.js';
import { FileJobDescription } from './model/file.job.description.enum.js';
import { FileJobResult } from './model/file.job.result.js';
import { FileResource } from './model/file.resource.entity.js';
import { FileStatus } from './model/file.status.enum.js';
import { FileParseProvider } from './parse/file.parse.provider.js';

@Injectable()
export class FileIteratorService {
  constructor(
    @InjectPinoLogger(FileIteratorService.name)
    private readonly logger: PinoLogger,
    private fileLocatorProvider: FileLocatorProvider,
    private fileParseProvider: FileParseProvider,
  ) {}

  async processFile(fileResource: FileResource): Promise<FileJobResult> {
    const fileJob = new FileJobResult({
      id: nanoid(),
      fileResource: fileResource,
      status: FileStatus.CREATED,
      description: FileJobDescription.PENDING,
      createDate: new Date(),
    });

    const fileLocator = this.fileLocatorProvider.getLocator(
      fileResource.storageType,
    );
    const downloaded = await fileLocator.fetchRemoteFile(fileResource);
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
      this.logger.trace(`Processed row: ${JSON.stringify(row)}`);
    }
    fileJob.status = FileStatus.PROCESSED;
    fileJob.description = FileJobDescription.FINISHED;
    return fileJob;
  }
}
