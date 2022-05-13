import { Test, TestingModule } from '@nestjs/testing';
import { fileResource } from '../__mocks__/file.resource.mock.js';
import { UtilsModule } from '../utils/utils.module.js';
import { FileIteratorService } from './file.iterator.service.js';
import { FileLocatorProvider } from './locate/file.locator.provider.js';
import { FileJobDescription } from './model/file.job.description.enum.js';
import { FileResource } from './model/file.resource.entity.js';
import { FileStatus } from './model/file.status.enum.js';
import { FileParseProvider } from './parse/file.parse.provider.js';

describe('File Iterator Service', () => {
  let fileIteratorService: FileIteratorService;
  let resource: FileResource;

  beforeEach(async () => {
    resource = new FileResource(JSON.parse(JSON.stringify(fileResource)));
    const app: TestingModule = await Test.createTestingModule({
      providers: [FileParseProvider, FileLocatorProvider, FileIteratorService],
      imports: [UtilsModule],
    }).compile();

    fileIteratorService = app.get<FileIteratorService>(FileIteratorService);
  });

  describe('FileIteratorService should get a request and return a response', () => {
    it('should return FINISHED and PROCESSED response with updated Date', async () => {
      const fileJobResult = await fileIteratorService.processFile(resource);
      expect(fileJobResult.id).not.toBeNull();
      expect(fileJobResult.createDate.getTime()).toBeLessThan(
        new Date().getTime(),
      );
      expect(fileJobResult.status).toBe(FileStatus.PROCESSED);
      expect(fileJobResult.description).toBe(FileJobDescription.FINISHED);
    });
  });
});
