import { computeTotp, generateTotpSecret, verifyTotp } from './totp';

const RFC_SECRET = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';

describe('computeTotp', () => {
  it('matches the RFC 6238 reference code at 59 seconds', async () => {
    expect(await computeTotp(RFC_SECRET, 59_000)).toBe('287082');
  });

  it('matches the RFC 6238 reference code at 1111111109 seconds', async () => {
    expect(await computeTotp(RFC_SECRET, 1_111_111_109_000)).toBe('081804');
  });
});

describe('verifyTotp', () => {
  it('accepts the code of the current step', async () => {
    expect(await verifyTotp(RFC_SECRET, '287082', 59_000)).toBe(true);
  });

  it('accepts the code of the previous step', async () => {
    expect(await verifyTotp(RFC_SECRET, '287082', 59_000 + 30_000)).toBe(true);
  });

  it('refuses a code two steps old', async () => {
    expect(await verifyTotp(RFC_SECRET, '287082', 59_000 + 60_000)).toBe(
      false,
    );
  });

  it('refuses a wrong code', async () => {
    expect(await verifyTotp(RFC_SECRET, '000000', 59_000)).toBe(false);
  });
});

describe('generateTotpSecret', () => {
  it('returns a base32 secret that differs each time', () => {
    const first = generateTotpSecret();

    expect(first).toMatch(/^[A-Z2-7]{32}$/);
    expect(generateTotpSecret()).not.toBe(first);
  });
});
