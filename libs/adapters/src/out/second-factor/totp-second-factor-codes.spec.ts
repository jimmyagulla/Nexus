import { computeTotp } from '@hexagonal-monorepo-template/infrastructure';
import { TotpSecondFactorCodes } from './totp-second-factor-codes';

const RFC_SECRET = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';

describe('TotpSecondFactorCodes', () => {
  it('generates a different secret each time', () => {
    const codes = new TotpSecondFactorCodes();

    expect(codes.generateSecret()).not.toBe(codes.generateSecret());
  });

  it('accepts the code issued from the secret', async () => {
    const at = new Date(59_000);

    expect(
      await new TotpSecondFactorCodes().matches(
        RFC_SECRET,
        await computeTotp(RFC_SECRET, at.getTime()),
        at,
      ),
    ).toBe(true);
  });

  it('refuses a code issued from another secret', async () => {
    const codes = new TotpSecondFactorCodes();
    const at = new Date(59_000);
    const other = codes.generateSecret();

    expect(
      await codes.matches(
        RFC_SECRET,
        await computeTotp(other, at.getTime()),
        at,
      ),
    ).toBe(false);
  });
});
