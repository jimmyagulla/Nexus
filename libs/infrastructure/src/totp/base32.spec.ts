import { decodeBase32, encodeBase32 } from './base32';

const bytes = (text: string) => new TextEncoder().encode(text);

describe('base32', () => {
  it('encodes bytes with the RFC 4648 alphabet', () => {
    expect(encodeBase32(bytes('12345678901234567890'))).toBe(
      'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ',
    );
  });

  it('decodes what it encodes', () => {
    const original = bytes('Hello, second factor!');

    expect(decodeBase32(encodeBase32(original))).toEqual(original);
  });

  it('decodes lower case and ignores padding and spaces', () => {
    expect(decodeBase32('mzxw6===')).toEqual(bytes('foo'));
    expect(decodeBase32('MZXW 6')).toEqual(bytes('foo'));
  });

  it('refuses a character outside the alphabet', () => {
    expect(() => decodeBase32('MZXW1')).toThrow();
  });
});
