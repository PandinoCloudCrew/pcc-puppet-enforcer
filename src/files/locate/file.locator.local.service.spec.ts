import { fileResource } from '../../__mocks__/file.resource.mock.js';
import { FileLocatorLocalService } from './file.locator.local.service.js';

describe('File Parse CSV', () => {
  let fileLocatorLocalService: FileLocatorLocalService;

  beforeEach(async () => {
    fileLocatorLocalService = new FileLocatorLocalService();
  });

  describe('read local file', () => {
    it('should validate file from local file system', async () => {
      const downloaded = await fileLocatorLocalService.downloadBytes(
        fileResource,
      );
      expect(downloaded).toBeTruthy();
    });
  });
});
