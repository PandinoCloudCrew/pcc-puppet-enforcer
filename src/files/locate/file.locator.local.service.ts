import { Logger } from '@nestjs/common';
import { constants, promises as fs } from 'fs';
import { LocalFileError } from '../../error/local.file.error.js';
import { FileResource } from '../model/file.resource.entity.js';
import { FileLocatorBase } from './file.locator.abstract.js';

export class FileLocatorLocalService extends FileLocatorBase {
  private readonly log = new Logger(FileLocatorLocalService.name);

  async downloadBytes(fileResource: FileResource): Promise<string> {
    try {
      await fs.access(fileResource.remotePath, constants.R_OK);
      this.log.debug(
        `file is available for reading at: ${fileResource.localPath}`,
      );
      return fileResource.remotePath;
    } catch (e) {
      const localFileError = new LocalFileError(
        'FileLocatorLocalService.downloadBytes',
        e,
      );
      this.log.error(
        `file at ${fileResource.remotePath} is not readable. ${localFileError.message}`,
      );
      throw localFileError;
    }
  }
}
