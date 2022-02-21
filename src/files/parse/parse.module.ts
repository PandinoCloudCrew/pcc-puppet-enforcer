import { Module } from '@nestjs/common';
import { FileParseProvider } from './file.parse.provider';

@Module({
  exports: [FileParseProvider],
  providers: [FileParseProvider],
})
export class ParseModule {}
