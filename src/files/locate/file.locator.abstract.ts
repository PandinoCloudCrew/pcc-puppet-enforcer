import { promises as fs } from 'fs';
import { PinoLogger } from 'nestjs-pino';
import path from 'path';
import { FileResource } from '../model/file.resource.entity.js';
import { FileType } from '../model/file.type.enum.js';
import { IFileLocator } from './file.locator.interface.js';

export abstract class FileLocatorBase implements IFileLocator {
  logger: PinoLogger;
  protected constructor(logger: PinoLogger) {
    this.logger = logger;
    this.logger.setContext(FileLocatorBase.name);
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
