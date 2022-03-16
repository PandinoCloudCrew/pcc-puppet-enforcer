import { Injectable } from '@nestjs/common';
import { FileStorage } from '../model/file.storage.enum.js';
import { IFileLocator } from './file.locator.interface.js';
import { FileLocatorLocalService } from './file.locator.local.service.js';

@Injectable()
export class FileLocatorProvider {
  getLocator(type: FileStorage): IFileLocator {
    const dummyLocator: IFileLocator = null;
    switch (type) {
      case FileStorage.LOCAL:
        return new FileLocatorLocalService();
      case FileStorage.FTP:
      case FileStorage.S3:
      default:
        return dummyLocator;
    }
  }
}
