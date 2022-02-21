import { Module } from '@nestjs/common';
import { LocateModule } from './locate/locate.module';
import { FormatModule } from './format/format.module';
import { ParseModule } from './parse/parse.module';
import { StoreModule } from './store/store.module';
import { FileIteratorService } from './file.iterator.service';
import { FileIteratorController } from './file.iterator.controller';

@Module({
  imports: [LocateModule, FormatModule, ParseModule, StoreModule],
  controllers: [FileIteratorController],
  providers: [FileIteratorService],
})
export class FilesModule {}
