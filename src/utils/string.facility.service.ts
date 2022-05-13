import { Injectable } from '@nestjs/common';

@Injectable()
export class StringFacilityService {
  /**
   * Calculate the byte length of string
   * assuming the String is UCS-2(aka UTF-16) encoded
   * @author https://stackoverflow.com/a/63893237/2107423
   * @param content
   */
  byteLengthOf(content: string): number {
    let charCount = 0;
    for (let idx = 0, len = content.length; idx < len; idx++) {
      const hi = content.charCodeAt(idx);
      if (hi < 0x0080) {
        //[0x0000, 0x007F]
        charCount += 1;
      } else if (hi < 0x0800) {
        //[0x0080, 0x07FF]
        charCount += 2;
      } else if (hi < 0xd800) {
        //[0x0800, 0xD7FF]
        charCount += 3;
      } else if (hi < 0xdc00) {
        //[0xD800, 0xDBFF]
        const lo = content.charCodeAt(++idx);
        if (idx < len && lo >= 0xdc00 && lo <= 0xdfff) {
          //followed by [0xDC00, 0xDFFF]
          charCount += 4;
        } else {
          throw new Error('UCS-2 String malformed');
        }
      } else if (hi < 0xe000) {
        //[0xDC00, 0xDFFF]
        throw new Error('UCS-2 String malformed');
      } else {
        //[0xE000, 0xFFFF]
        charCount += 3;
      }
    }
    return charCount;
  }
}
