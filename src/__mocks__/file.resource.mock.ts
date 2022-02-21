import { FileResource } from '../files/model/file.resource.entity';
import { randomUUID } from 'crypto';
import { FileStatus } from '../files/model/file.status.enum';
import { FileStorage } from '../files/model/file.storage.enum';
import { FileType } from '../files/model/file.type.enum';
import { FileFormatMap } from '../files/format/file.format.map';
import { FileRowType } from '../files/format/file.row.type.enum';

const fileResource = new FileResource({
  id: randomUUID(),
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

export { fileResource };
