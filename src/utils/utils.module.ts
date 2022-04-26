import { Module } from '@nestjs/common';
import { MathFacilityService } from './math.facility.service.js';
import { StringFacilityService } from './string.facility.service.js';

@Module({
  exports: [MathFacilityService, StringFacilityService],
  providers: [MathFacilityService, StringFacilityService],
})
export class UtilsModule {}
