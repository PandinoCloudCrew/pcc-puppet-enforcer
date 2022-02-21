import { Module } from '@nestjs/common';
import { FileLocatorProvider } from './file.locator.provider';

@Module({
  exports: [FileLocatorProvider],
  providers: [FileLocatorProvider],
})
export class LocateModule {}
