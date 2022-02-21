import { FileResource } from '../model/file.resource.entity';

export interface IFileLocator {
  downloadBytes(fileResource: FileResource): Promise<boolean>;
}
