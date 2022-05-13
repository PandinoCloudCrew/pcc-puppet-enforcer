import { Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import path from 'path';
import { FileResource } from '../model/file.resource.entity.js';
import { FileType } from '../model/file.type.enum.js';
import { IFileLocator } from './file.locator.interface.js';

export abstract class FileLocatorBase implements IFileLocator {
  logger: Logger;
  protected constructor(logger: Logger) {
    this.logger = logger;
  }

  abstract downloadBytes(fileResource: FileResource): Promise<string>;

  async fetchRemoteFile(fileResource: FileResource): Promise<boolean> {
    try {
      const extname = path.extname(fileResource.remotePath);
      fileResource.fileType = this.fileTypeFromExtension(extname);
      fileResource.name = path.basename(fileResource.remotePath);
      fileResource.localPath = await this.downloadBytes(fileResource);
      return await this.checkLocalFile(fileResource);
    } catch (e) {
      this.logger.error(`unable to read file contents: ${e.message}`);
      throw e;
    }
  }

  async checkLocalFile(fileResource: FileResource): Promise<boolean> {
    const fileStats = await fs.stat(fileResource.localPath);
    fileResource.size = fileStats.size;
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
