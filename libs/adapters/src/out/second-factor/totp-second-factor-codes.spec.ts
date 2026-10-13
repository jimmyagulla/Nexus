import { describe, expect, it } from 'vitest';
import { TotpSecondFactorCodes } from './totp-second-factor-codes';

const BASE32_SECRET = /^[A-Z2-7]{32}$/;

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
