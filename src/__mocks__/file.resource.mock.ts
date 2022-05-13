import { nanoid } from 'nanoid';
import path from 'path';
import { fileURLToPath } from 'url';
import { FileFormatMap } from '../files/format/file.format.map.js';
import { FileRowType } from '../files/format/file.row.type.enum.js';
import { FileResource } from '../files/model/file.resource.entity.js';
import { FileStatus } from '../files/model/file.status.enum.js';
import { FileStorage } from '../files/model/file.storage.enum.js';
import { FileType } from '../files/model/file.type.enum.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const fileResource = new FileResource({
  id: nanoid(),
  status: FileStatus.CREATED,
  columnSeparator: ',',
  storageType: FileStorage.LOCAL,
  fileType: FileType.CSV,
  remotePath: __dirname + '/test-users.csv',
  localPath: __dirname + '/test-users.csv',
  columnFormat: [
    new FileFormatMap({
      index: 0,
      name: 'usuario',
      type: FileRowType.TEXT,
    }),
    new FileFormatMap({
      index: 1,
      name: 'edad',
      type: FileRowType.NUMBER,
    }),
    new FileFormatMap({
      index: 2,
      name: 'creado',
      type: FileRowType.DATE,
    }),
  ],
});
