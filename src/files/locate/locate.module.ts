import { Module } from '@nestjs/common';
import { FileLocatorProvider } from './file.locator.provider.js';

@Module({
  exports: [FileLocatorProvider],
  providers: [FileLocatorProvider],
})
export class LocateModule {}
