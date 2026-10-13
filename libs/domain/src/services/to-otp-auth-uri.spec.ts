import { toOtpAuthUri } from './to-otp-auth-uri';

describe('toOtpAuthUri', () => {
  it('builds the address an authenticator application reads', () => {
    expect(
      toOtpAuthUri({ issuer: 'Nexus', accountName: 'u1', secret: 'ABCDEF' }),
    ).toBe('otpauth://totp/Nexus:u1?secret=ABCDEF&issuer=Nexus');
  });

  it('escapes the issuer and the account name', () => {
    expect(
      toOtpAuthUri({ issuer: 'Ma Boite', accountName: 'a b', secret: 'ABC' }),
    ).toBe('otpauth://totp/Ma%20Boite:a%20b?secret=ABC&issuer=Ma%20Boite');
  });
});
