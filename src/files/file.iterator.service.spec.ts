import { Test, TestingModule } from '@nestjs/testing';
import { fileResource } from '../__mocks__/file.resource.mock.js';
import { FileIteratorService } from './file.iterator.service.js';
import { FileLocatorProvider } from './locate/file.locator.provider.js';
import { FileJobDescription } from './model/file.job.description.enum.js';
import { FileStatus } from './model/file.status.enum.js';
import { FileParseProvider } from './parse/file.parse.provider.js';

describe('File Iterator Service', () => {
  let fileIteratorService: FileIteratorService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [FileParseProvider, FileLocatorProvider, FileIteratorService],
    }).compile();

    fileIteratorService = app.get<FileIteratorService>(FileIteratorService);
  });

  describe('root', () => {
    it('should return "Hello World!"', async () => {
      const fileJobResult = await fileIteratorService.processFile(fileResource);
      expect(fileJobResult.id).not.toBeNull();
      expect(fileJobResult.createDate.getTime()).toBeLessThan(
        new Date().getTime(),
      );
      expect(fileJobResult.status).toBe(FileStatus.PROCESSED);
      expect(fileJobResult.description).toBe(FileJobDescription.FINISHED);
    });
  });
});
