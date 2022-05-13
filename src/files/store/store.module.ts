import { Module } from '@nestjs/common';
import { UtilsModule } from '../../utils/utils.module.js';

@Module({
  imports: [UtilsModule],
})
export class StoreModule {}
