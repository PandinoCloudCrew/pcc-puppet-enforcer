import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Logger } from '@nestjs/common';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { FileNotFoundS3Error } from '../../error/file.not.found.s3.error.js';
import { FileResource } from '../model/file.resource.entity.js';
import { FileLocatorBase } from './file.locator.abstract.js';

export class FileLocatorS3Service extends FileLocatorBase {
  private readonly log = new Logger(FileLocatorS3Service.name);
  s3: S3Client;

  constructor(s3: S3Client) {
    super();
    this.s3 = s3;
  }

  readS3Uri(remotePath: string): {
    Bucket: string;
    Key: string;
  } {
    const uriComponents = remotePath.match(
      /^([a-z][a-z0-9+\-.]*:\/\/([^/?#]+)?)?([a-z0-9\-._~%!$&'()*+,;=:@/]*)/,
    );
    return { Bucket: uriComponents[2], Key: uriComponents[3] };
  }

  async downloadBytes(fileResource: FileResource): Promise<string> {
    try {
      const { Bucket, Key } = this.readS3Uri(fileResource.remotePath);
      const { Body } = await this.s3.send(
        new GetObjectCommand({ Bucket, Key }),
      );
      const body = Body as Readable;
      const tempFileName = path.join('/tmp', fileResource.name);
      const tempFile = fs.createWriteStream(tempFileName);
      body.pipe(tempFile);
      return tempFileName;
    } catch (e) {
      if (e?.name === 'NoSuchKey')
        throw new FileNotFoundS3Error('FileLocatorS3Service.downloadBytes', e);
      throw e;
    }
  }
}
