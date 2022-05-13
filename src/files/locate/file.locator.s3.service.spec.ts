import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Logger } from '@nestjs/common';
import { mockClient } from 'aws-sdk-client-mock';
import fs from 'fs';
import { fileResource } from '../../__mocks__/file.resource.mock.js';
import { FileNotFoundS3Error } from '../../error/file.not.found.s3.error.js';
import { FileResource } from '../model/file.resource.entity.js';
import { FileLocatorS3Service } from './file.locator.s3.service.js';
import { s3Client } from './s3/s3.client.js';

const s3mock = mockClient(S3Client);
describe('Fetch S3 CSV File', () => {
  let fileLocatorLocalService: FileLocatorS3Service;
  let resource: FileResource;

  beforeEach(async () => {
    s3mock.reset();
    resource = JSON.parse(JSON.stringify(fileResource)) as FileResource;
    fileLocatorLocalService = new FileLocatorS3Service(
      new Logger(FileLocatorS3Service.name),
      s3Client,
    );
  });

  describe('read file from S3', () => {
    const Bucket = 'pcc-dev-puppet-enforcer-storage';
    it('should parse S3 uri with nested path to get file properties', async () => {
      const Key = '/very/long/path/nested/test-users.csv';
      const s3Uri = `s3://${Bucket}${Key}`;
      const uriProperties = fileLocatorLocalService.readS3Uri(s3Uri);
      expect(uriProperties.Bucket).toEqual(Bucket);
      expect(uriProperties.Key).toEqual(Key);
    });

    it('should parse S3 uri over root path to get file properties', async () => {
      const Key = '/test-users.csv';
      const s3Uri = `s3://${Bucket}${Key}`;
      const uriProperties = fileLocatorLocalService.readS3Uri(s3Uri);
      expect(uriProperties.Bucket).toEqual(Bucket);
      expect(uriProperties.Key).toEqual(Key.substring(1));
    });

    it('should throw FileNotFoundS3Error if file is not found', async () => {
      const Key = 'test-users.csv';
      const s3Uri = `s3://${Bucket}/${Key}`;
      s3mock.on(GetObjectCommand).rejects({
        name: 'NoSuchKey',
      });
      resource.remotePath = s3Uri;
      resource.name = 'test-users.csv';
      await expect(
        async () => await fileLocatorLocalService.downloadBytes(resource),
      ).rejects.toThrow(FileNotFoundS3Error);
    });

    it('should validate object from s3 storage', async () => {
      const Key = 'test-users.csv';
      const s3Uri = `s3://${Bucket}/${Key}`;
      s3mock
        .on(GetObjectCommand)
        .resolves({ Body: fs.createReadStream(resource.remotePath) });
      resource.remotePath = s3Uri;
      resource.name = 'test-users.csv';
      const downloaded = await fileLocatorLocalService.downloadBytes(resource);
      expect(downloaded).toBeTruthy();
    });
  });
});
