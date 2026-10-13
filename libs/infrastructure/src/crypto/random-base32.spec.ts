import { randomBase32 } from './random-base32';

describe('randomBase32', () => {
  it('returns the requested number of base32 characters', () => {
    expect(randomBase32(10)).toMatch(/^[A-Z2-7]{10}$/);
    expect(randomBase32(1)).toMatch(/^[A-Z2-7]$/);
  });

  it('differs each time', () => {
    expect(randomBase32(16)).not.toBe(randomBase32(16));
  });
});
