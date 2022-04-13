import { MathFacilityService } from './math.facility.service.js';

describe('Should be able to validate fibonacci number', () => {
  let mathFacility: MathFacilityService;
  beforeEach(() => {
    mathFacility = new MathFacilityService();
  });
  it('Should find the nearest fibonacci to 140 (nearest checkpoint without computing next value)', async () => {
    const cache = new Set<number>();
    console.time('fibonacci');

    for (let idx = 0; idx <= 140; idx++) {
      const nearestFib = mathFacility.nearestFibonacci(idx);
      cache.add(nearestFib);
    }

    console.timeEnd('fibonacci');
    const computedValues = new Set<number>(Object.values(mathFacility.cache));
    expect(cache).toEqual(computedValues);
  });

  it('Continue processing as long as available value is fibonacci', async () => {
    let currentValue = 0;
    let computedValue = 0;
    const computeLimit = 30;

    do {
      if (mathFacility.isFibonacci(currentValue)) computedValue++;
      currentValue++;
    } while (computedValue < computeLimit);

    expect(computedValue).toEqual(computeLimit);
    expect(currentValue - 1).toEqual(mathFacility.cache[computedValue]);
  });
});
