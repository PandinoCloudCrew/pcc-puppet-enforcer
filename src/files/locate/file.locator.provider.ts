import { Injectable, Logger } from '@nestjs/common';
import { FileStorage } from '../model/file.storage.enum.js';
import { FileLocatorBase } from './file.locator.abstract.js';
import { FileLocatorLocalService } from './file.locator.local.service.js';
import { FileLocatorS3Service } from './file.locator.s3.service.js';
import { s3Client } from './s3/s3.client.js';

@Injectable()
export class FileLocatorProvider {
  private readonly logger = new Logger(FileLocatorProvider.name);

  getLocator(type: FileStorage): FileLocatorBase {
    const dummyLocator: FileLocatorBase = null;
    switch (type) {
      case FileStorage.LOCAL:
        return new FileLocatorLocalService(this.logger);
      case FileStorage.S3:
        return new FileLocatorS3Service(this.logger, s3Client);
      case FileStorage.FTP:
      default:
        return dummyLocator;
    }
  }
}
