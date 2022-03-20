import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import fs from 'fs';
import { fileResource } from '../../__mocks__/file.resource.mock.js';
import { FileLocatorS3Service } from './file.locator.s3.service.js';
import { s3Client } from './s3/s3.client.js';
import { mockClient } from 'aws-sdk-client-mock';

const s3mock = mockClient(S3Client);
describe('Fetch S3 CSV File', () => {
  let fileLocatorLocalService: FileLocatorS3Service;
  beforeEach(async () => {
    s3mock.reset();
    fileLocatorLocalService = new FileLocatorS3Service(s3Client);
  });

  describe('read file from S3', () => {
    const Bucket = 'pcc-dev-puppet-enforcer-storage';
    const Key = '/very/long/path/nested/test-users.csv';
    const s3Uri = `s3://${Bucket}${Key}`;
    it('should parse S3 uri to get file properties', async () => {
      const uriProperties = fileLocatorLocalService.readS3Uri(s3Uri);
      expect(uriProperties.Bucket).toEqual(Bucket);
      expect(uriProperties.Key).toEqual(Key);
    });

    it('should validate object from s3 storage', async () => {
      s3mock
        .on(GetObjectCommand)
        .resolves({ Body: fs.createReadStream(fileResource.remotePath) });
      fileResource.remotePath = s3Uri;
      fileResource.name = 'test-users.csv';
      const downloaded = await fileLocatorLocalService.downloadBytes(
        fileResource,
      );
      expect(downloaded).toBeTruthy();
    });
  });
});
