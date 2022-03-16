import { Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { FileResource } from '../model/file.resource.entity.js';
import { FileType } from '../model/file.type.enum.js';
import { IFileLocator } from './file.locator.interface.js';

export class FileLocatorLocalService implements IFileLocator {
  private readonly logger = new Logger(FileLocatorLocalService.name);

  async downloadBytes(fileResource: FileResource): Promise<boolean> {
    const fileStats = await fs.stat(fileResource.remotePath);
    const extname = path.extname(fileResource.remotePath);
    fileResource.fileType = this.fileTypeFromExtension(extname);
    fileResource.name = path.basename(fileResource.remotePath);
    fileResource.size = fileStats.size;
    fileResource.localPath = fileResource.remotePath;
    return fileStats.isFile();
  }

  fileTypeFromExtension(fileExtension: string): FileType {
    switch (fileExtension) {
      case '.csv':
        return FileType.CSV;
      default:
        return FileType.CHAR_DELIMITED;
    }
  }
}
