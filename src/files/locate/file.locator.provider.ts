import { S3 } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { FileStorage } from '../model/file.storage.enum.js';
import { FileLocatorBase } from './file.locator.abstract.js';
import { FileLocatorLocalService } from './file.locator.local.service.js';
import { FileLocatorS3Service } from './file.locator.s3.service.js';

@Injectable()
export class FileLocatorProvider {
  getLocator(type: FileStorage): FileLocatorBase {
    const dummyLocator: FileLocatorBase = null;
    switch (type) {
      case FileStorage.LOCAL:
        return new FileLocatorLocalService();
      case FileStorage.S3:
        return new FileLocatorS3Service(new S3({}));
      case FileStorage.FTP:
      default:
        return dummyLocator;
    }
  }
}
