import { describe, expect, it } from 'vitest';
import { decodeBase64, encodeBase64 } from './base64';

describe('base64', () => {
  it('encodes bytes', () => {
    expect(encodeBase64(new Uint8Array([72, 101, 108, 108, 111]))).toBe(
      'SGVsbG8=',
    );
  });

  it('decodes bytes', () => {
    expect(decodeBase64('SGVsbG8=')).toEqual(
      new Uint8Array([72, 101, 108, 108, 111]),
    );
  });

  it('encodes nothing as an empty text', () => {
    expect(encodeBase64(new Uint8Array())).toBe('');
  });

  it('gets back the bytes it encoded, whatever their value', () => {
    const bytes = Uint8Array.from({ length: 256 }, (_, index) => index);

    expect(decodeBase64(encodeBase64(bytes))).toEqual(bytes);
  });

  it('handles a file larger than one chunk', () => {
    const bytes = Uint8Array.from(
      { length: 0x8000 * 2 + 17 },
      (_, index) => index % 251,
    );

    expect(decodeBase64(encodeBase64(bytes))).toEqual(bytes);
  });
});
