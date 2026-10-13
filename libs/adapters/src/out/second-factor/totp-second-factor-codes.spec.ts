import { describe, expect, it } from 'vitest';
import { TotpSecondFactorCodes } from './totp-second-factor-codes';

const BASE32_SECRET = /^[A-Z2-7]{32}$/;

// RFC 6238 appendix B: the ASCII secret 12345678901234567890, 30 s steps.
const RFC_SECRET = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';

function atSeconds(seconds: number): Date {
  return new Date(seconds * 1000);
}

describe('TotpSecondFactorCodes', () => {
  it('issues a base32 secret an authenticator application accepts', () => {
    expect(new TotpSecondFactorCodes().issueSecret()).toMatch(BASE32_SECRET);
  });

  it('issues a different secret every time', () => {
    const codes = new TotpSecondFactorCodes();

    expect(codes.issueSecret()).not.toBe(codes.issueSecret());
  });

  it('describes the secret as a time-based one-time password to enrol', () => {
    const uri = new TotpSecondFactorCodes().provisioningUri(
      'alice',
      'JBSWY3DPEHPK3PXP',
    );

    expect(uri).toBe(
      'otpauth://totp/Nexus:alice?secret=JBSWY3DPEHPK3PXP&issuer=Nexus',
    );
  });

  describe('verifying a code', () => {
    it('accepts the code of the current period', async () => {
      await expect(
        new TotpSecondFactorCodes().verify(RFC_SECRET, '287082', atSeconds(59)),
      ).resolves.toBe(true);
    });

    it('accepts the other published codes of the reference', async () => {
      const codes = new TotpSecondFactorCodes();

      await expect(
        codes.verify(RFC_SECRET, '050471', atSeconds(1111111111)),
      ).resolves.toBe(true);
      await expect(
        codes.verify(RFC_SECRET, '005924', atSeconds(1234567890)),
      ).resolves.toBe(true);
      await expect(
        codes.verify(RFC_SECRET, '279037', atSeconds(2000000000)),
      ).resolves.toBe(true);
    });

    it('accepts a code that starts with zeros', async () => {
      await expect(
        new TotpSecondFactorCodes().verify(
          RFC_SECRET,
          '081804',
          atSeconds(1111111109),
        ),
      ).resolves.toBe(true);
    });

    it('accepts the code of the previous period, for a slow clock', async () => {
      await expect(
        new TotpSecondFactorCodes().verify(RFC_SECRET, '287082', atSeconds(89)),
      ).resolves.toBe(true);
    });

    it('accepts the code of the next period, for a fast clock', async () => {
      await expect(
        new TotpSecondFactorCodes().verify(RFC_SECRET, '287082', atSeconds(29)),
      ).resolves.toBe(true);
    });

    it('refuses a code two periods old', async () => {
      await expect(
        new TotpSecondFactorCodes().verify(RFC_SECRET, '287082', atSeconds(119)),
      ).resolves.toBe(false);
    });

    it('refuses a wrong code', async () => {
      await expect(
        new TotpSecondFactorCodes().verify(RFC_SECRET, '000000', atSeconds(59)),
      ).resolves.toBe(false);
    });

    it('refuses a code that is not made of six digits', async () => {
      const codes = new TotpSecondFactorCodes();

      await expect(
        codes.verify(RFC_SECRET, '28708', atSeconds(59)),
      ).resolves.toBe(false);
      await expect(
        codes.verify(RFC_SECRET, '2870820', atSeconds(59)),
      ).resolves.toBe(false);
      await expect(
        codes.verify(RFC_SECRET, '28708a', atSeconds(59)),
      ).resolves.toBe(false);
      await expect(codes.verify(RFC_SECRET, '', atSeconds(59))).resolves.toBe(
        false,
      );
    });

    it('ignores the spaces around the code', async () => {
      await expect(
        new TotpSecondFactorCodes().verify(
          RFC_SECRET,
          ' 287082 ',
          atSeconds(59),
        ),
      ).resolves.toBe(true);
    });

    it('refuses every code when the secret is not base32', async () => {
      await expect(
        new TotpSecondFactorCodes().verify('not base32!', '287082', atSeconds(59)),
      ).resolves.toBe(false);
    });
  });

  it('escapes a label that carries reserved characters', () => {
    const uri = new TotpSecondFactorCodes().provisioningUri(
      'alice martin@acme.fr',
      'JBSWY3DPEHPK3PXP',
    );

    expect(uri).toBe(
      'otpauth://totp/Nexus:alice%20martin%40acme.fr?secret=JBSWY3DPEHPK3PXP&issuer=Nexus',
    );
  });
});
