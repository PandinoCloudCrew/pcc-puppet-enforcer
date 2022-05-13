import { Injectable, Logger } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { MathFacilityService } from '../utils/math.facility.service.js';
import { FileFormatHash } from './format/file.format.hash.js';
import { FileLocatorProvider } from './locate/file.locator.provider.js';
import { FileJobDescription } from './model/file.job.description.enum.js';
import { FileJobResult } from './model/file.job.result.js';
import { FileResource } from './model/file.resource.entity.js';
import { FileStatus } from './model/file.status.enum.js';
import { FileParseProvider } from './parse/file.parse.provider.js';

@Injectable()
export class FileIteratorService {
  private readonly logger = new Logger(FileIteratorService.name);
  constructor(
    private fileLocatorProvider: FileLocatorProvider,
    private fileParseProvider: FileParseProvider,
    private mathFacility: MathFacilityService,
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

    let rowCounter = 0;
    for await (const row of fileRows) {
      fileJob.rows.push(row);
      if (this.mathFacility.isFibonacci(rowCounter++))
        this.logger.log(`Processed row ${rowCounter}: ${JSON.stringify(row)}`);
    }
    fileJob.status = FileStatus.PROCESSED;
    fileJob.description = FileJobDescription.FINISHED;
    return fileJob;
  }
}
