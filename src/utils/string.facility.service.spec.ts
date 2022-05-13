import { Blob } from 'buffer';
import { nanoid } from 'nanoid';
import { StringFacilityService } from './string.facility.service.js';

describe('StringFacilityService Should be able to process strings', () => {
  let stringFacility: StringFacilityService;

  beforeEach(() => {
    stringFacility = new StringFacilityService();
  });

  it('byteLengthOf should calculate the length of a complex string', async () => {
    const content = '😀∑Ω©√ßœ´®†¥¨ˆøπ¬˚∆˙©ƒ∂ßåΩ≈ç√∫˜µ≤æ\n\t';
    const contentLength = stringFacility.byteLengthOf(content);
    expect(contentLength).toEqual(new Blob([content]).size);
    expect(contentLength).toEqual(Buffer.byteLength(content, 'utf-8'));
  });

  it('byteLengthOf should calculate the length of a simple string', async () => {
    const content = 'This is a test for a simple string áéíó 123398';
    const contentLength = stringFacility.byteLengthOf(content);
    expect(contentLength).toEqual(new Blob([content]).size);
    expect(contentLength).toEqual(Buffer.byteLength(content, 'utf-8'));
  });

  it('byteLengthOf should calculate the length of a JSON string', async () => {
    const content = JSON.stringify({
      date: new Date().toISOString(),
      number: Math.random(),
      text: 'This is some text written for this test',
      id: nanoid(),
    });
    const contentLength = stringFacility.byteLengthOf(content);
    expect(contentLength).toEqual(new Blob([content]).size);
    expect(contentLength).toEqual(Buffer.byteLength(content, 'utf-8'));
  });
});
