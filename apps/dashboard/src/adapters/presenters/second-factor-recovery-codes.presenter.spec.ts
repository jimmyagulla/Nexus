import { describe, expect, it } from 'vitest';
import { SecondFactorRecoveryCodesPresenter } from './second-factor-recovery-codes.presenter';

describe('SecondFactorRecoveryCodesPresenter', () => {
  it('writes each code in two halves to be copied by hand', () => {
    expect(
      new SecondFactorRecoveryCodesPresenter().present({
        enrolled: true,
        recoveryCodes: ['ABCDE23456', 'FGHIJ23457'],
      }),
    ).toEqual({ codes: ['ABCDE-23456', 'FGHIJ-23457'] });
  });

  it('presents no code when none was handed over', () => {
    expect(
      new SecondFactorRecoveryCodesPresenter().present({
        enrolled: true,
        recoveryCodes: [],
      }),
    ).toEqual({ codes: [] });
  });
});
