import { Test, TestingModule } from '@nestjs/testing';
import { FileIteratorController } from './file.iterator.controller';
import { FileIteratorService } from './file.iterator.service';
import { fileResource } from '../__mocks__/file.resource.mock';
import { FilesModule } from './files.module';
import { FileLocatorProvider } from './locate/file.locator.provider';
import { FileParseProvider } from './parse/file.parse.provider';

describe('AppController', () => {
  let fileIteratorController: FileIteratorController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FileIteratorController],
      imports: [FilesModule],
      providers: [FileLocatorProvider, FileParseProvider, FileIteratorService],
    }).compile();

    fileIteratorController = app.get<FileIteratorController>(
      FileIteratorController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', async () => {
      const fileJobResult = await fileIteratorController.requestFileProcessing(
        fileResource,
      );
      expect(fileJobResult.fileResource.lines).toBeGreaterThan(0);
      fileResource.lines = fileJobResult.fileResource.lines;
      expect(fileJobResult.fileResource.size).toBeGreaterThan(0);
      fileResource.size = fileJobResult.fileResource.size;
      fileResource.name = fileJobResult.fileResource.name;
      expect(fileJobResult.fileResource).toStrictEqual(fileResource);
    });
  });
});
