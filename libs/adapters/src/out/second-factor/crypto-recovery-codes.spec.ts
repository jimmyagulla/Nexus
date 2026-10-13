import { RECOVERY_CODE_PATTERN } from '@hexagonal-monorepo-template/domain';
import { CryptoRecoveryCodes } from './crypto-recovery-codes';

describe('CryptoRecoveryCodes', () => {
  it('generates the requested number of recovery codes', () => {
    const codes = new CryptoRecoveryCodes().generate(8);

    expect(codes).toHaveLength(8);
    expect(codes.filter((code) => !RECOVERY_CODE_PATTERN.test(code))).toEqual(
      [],
    );
  });

  it('generates codes that all differ', () => {
    const codes = new CryptoRecoveryCodes().generate(8);

    expect(new Set(codes).size).toBe(8);
  });

  it('digests a code the same way each time', async () => {
    const recovery = new CryptoRecoveryCodes();

    expect(await recovery.digest('ABCDE23456')).toBe(
      await recovery.digest('ABCDE23456'),
    );
  });

  it('digests two codes differently', async () => {
    const recovery = new CryptoRecoveryCodes();

    expect(await recovery.digest('ABCDE23456')).not.toBe(
      await recovery.digest('ABCDE23457'),
    );
  });

  it('does not keep the code readable in its digest', async () => {
    expect(await new CryptoRecoveryCodes().digest('ABCDE23456')).not.toContain(
      'ABCDE23456',
    );
  });
});
