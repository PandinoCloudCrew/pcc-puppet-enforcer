import { FileParseCsvService } from './file.parse.csv.service';
import { FileFormatHash } from '../format/file.format.hash';
import { fileResource } from '../../__mocks__/file.resource.mock';

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
        expect(fileRow.values.size).toBe(fileResource.columnFormat.length);
      }
      expect(fileResource.lines).toBeGreaterThan(0);
      expect(fileResource.columnName.size).toBeGreaterThan(0);
    });
  });
});
