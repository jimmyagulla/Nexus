import { decodeBase64, encodeBase64 } from './base64';

describe('base64', () => {
  it('encodes bytes as base64 text', () => {
    expect(encodeBase64(new Uint8Array([72, 105]))).toBe('SGk=');
  });

  it('decodes base64 text back to the same bytes', () => {
    expect([...decodeBase64('SGk=')]).toEqual([72, 105]);
  });

  it('round-trips every byte value', () => {
    const everything = Uint8Array.from({ length: 256 }, (_, index) => index);

    expect([...decodeBase64(encodeBase64(everything))]).toEqual([
      ...everything,
    ]);
  });

  it('round-trips content larger than one encoding chunk', () => {
    const large = Uint8Array.from({ length: 100_000 }, (_, i) => i % 251);

    expect(decodeBase64(encodeBase64(large))).toEqual(large);
  });

  it('encodes nothing as an empty text', () => {
    expect(encodeBase64(new Uint8Array())).toBe('');
  });
});
