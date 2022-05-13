import { Injectable } from '@nestjs/common';

@Injectable()
export class MathFacilityService {
  logroot5 = Math.log(5) / 2;
  logphi = Math.log((1 + 5 ** 0.5) / 2);
  cache = {
    0: 0,
    1: 1,
  };

  fastFibonacci(n: number): number {
    if (this.cache.hasOwnProperty(n)) {
      return this.cache[n];
    }
    const m = Math.trunc((n + 1) / 2);
    const a = this.fastFibonacci(m - 1);
    const b = this.fastFibonacci(m);
    const fib = n & 1 ? a * a + b * b : (2 * a + b) * b;
    this.cache[n] = fib;
    return fib;
  }

  nearestFibonacci(n: number): number {
    if (n == 0) return 0;
    //Approximate by inverting the large term of Binet's formula
    const y = ~~((Math.log(n) + this.logroot5) / this.logphi);
    const lo = this.fastFibonacci(y);
    const hi = this.fastFibonacci(y + 1);
    return n - lo < hi - n ? lo : hi;
  }

  isFibonacci(n: number): boolean {
    return n === this.nearestFibonacci(n);
  }
}
