import { FileResource } from '../model/file.resource.entity.js';

export interface IFileLocator {
  downloadBytes(fileResource: FileResource): Promise<boolean>;
}
