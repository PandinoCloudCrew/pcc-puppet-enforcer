import { fileResource } from '../../__mocks__/file.resource.mock.js';
import { FileFormatHash } from '../format/file.format.hash.js';
import { FileParseCsvService } from './file.parse.csv.service.js';

describe('File Parse CSV', () => {
  let fileParseCsvService: FileParseCsvService;

  beforeEach(async () => {
    fileParseCsvService = new FileParseCsvService();
  });

  describe('parse local file', () => {
    it('should read csv contents into rows', async () => {
      const fileFormatHash = new FileFormatHash(fileResource);
      const fileRows = fileParseCsvService.readContents(
        fileFormatHash,
        fileResource,
      );
      for await (const fileRow of fileRows) {
        expect(fileRow.id).toBeDefined();
        expect(fileRow.index).toBe(fileResource.lines);
        expect(fileRow.columns).toBe(fileResource.columnFormat.length);
      }
      expect(fileResource.lines).toBeGreaterThan(0);
      expect(fileResource.columnName).toBeTruthy();
    });
  });
});
