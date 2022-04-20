import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from 'nestjs-pino';
import { fileResource } from '../__mocks__/file.resource.mock.js';
import { UtilsModule } from '../utils/utils.module.js';
import { FileIteratorController } from './file.iterator.controller.js';
import { FileIteratorService } from './file.iterator.service.js';
import { FilesModule } from './files.module.js';
import { FileLocatorProvider } from './locate/file.locator.provider.js';
import { FileResource } from './model/file.resource.entity.js';
import { FileParseProvider } from './parse/file.parse.provider.js';

describe('AppController', () => {
  let fileIteratorController: FileIteratorController;
  let resource: FileResource;

  beforeEach(async () => {
    resource = new FileResource(JSON.parse(JSON.stringify(fileResource)));
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FileIteratorController],
      imports: [
        FilesModule,
        UtilsModule,
        LoggerModule.forRootAsync({
          useFactory: async () => {
            return {
              pinoHttp: {
                name: 'pcc-puppet-enforcer-AppController',
              },
            };
          },
        }),
      ],
      providers: [FileLocatorProvider, FileParseProvider, FileIteratorService],
    }).compile();

    fileIteratorController = app.get<FileIteratorController>(
      FileIteratorController,
    );
  });

  describe('FileIteratorController should handle a request to process a file', () => {
    it('requestFileProcessing should return fileResource with computed values from file', async () => {
      const fileJobResult = await fileIteratorController.requestFileProcessing(
        resource,
      );
      expect(fileJobResult.fileResource.lines).toBeGreaterThan(0);
      resource.lines = fileJobResult.fileResource.lines;
      expect(fileJobResult.fileResource.size).toBeGreaterThan(0);
      resource.size = fileJobResult.fileResource.size;
      resource.name = fileJobResult.fileResource.name;
      expect(fileJobResult.fileResource).toStrictEqual(resource);
    });
  });
});
