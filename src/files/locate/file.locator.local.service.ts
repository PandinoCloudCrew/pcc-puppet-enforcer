import { IFileLocator } from './file.locator.interface';
import { FileResource } from '../model/file.resource.entity';
import { promises as fs } from 'fs';
import { FileType } from '../model/file.type.enum';
import { Logger } from '@nestjs/common';
import * as path from 'path';

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
