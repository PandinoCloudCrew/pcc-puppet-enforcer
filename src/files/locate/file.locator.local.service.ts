import { Logger } from '@nestjs/common';
import { constants, promises as fs } from 'fs';
import { LocalFileError } from '../../error/local.file.error.js';
import { FileResource } from '../model/file.resource.entity.js';
import { FileLocatorBase } from './file.locator.abstract.js';

export class FileLocatorLocalService extends FileLocatorBase {
  logger: Logger;

  constructor(logger: Logger) {
    super(logger);
    this.logger = logger;
  }

  async downloadBytes(fileResource: FileResource): Promise<string> {
    try {
      await fs.access(fileResource.remotePath, constants.R_OK);
      this.logger.debug(
        `file is available for reading at: ${fileResource.localPath}`,
      );
      return fileResource.remotePath;
    } catch (e) {
      const localFileError = new LocalFileError(
        'FileLocatorLocalService.downloadBytes',
        e,
      );
      this.logger.error(
        `file at ${fileResource.remotePath} is not readable. ${localFileError.message}`,
      );
      throw localFileError;
    }
  }
}
