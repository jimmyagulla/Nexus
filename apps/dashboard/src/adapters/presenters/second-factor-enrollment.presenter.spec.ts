import { describe, expect, it } from 'vitest';
import { SecondFactorEnrollmentPresenter } from './second-factor-enrollment.presenter';

describe('SecondFactorEnrollmentPresenter', () => {
  it('cuts the secret in groups of four to be typed by hand', () => {
    expect(
      new SecondFactorEnrollmentPresenter().present({
        secret: 'ABCDEFGHIJ',
        provisioningUri: 'otpauth://x',
      }),
    ).toEqual({ secret: 'ABCD EFGH IJ', provisioningUri: 'otpauth://x' });
  });
});
