import { IFileLocator } from './file.locator.interface';
import { Injectable } from '@nestjs/common';
import { FileStorage } from '../model/file.storage.enum';
import { FileLocatorLocalService } from './file.locator.local.service';

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
