import { Module } from '@nestjs/common';
import { MathFacilityService } from './math.facility.service.js';

@Module({
  exports: [MathFacilityService],
  providers: [MathFacilityService],
})
export class UtilsModule {}
