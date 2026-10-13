import { describe, expect, it } from 'vitest';
import { SecondFactorEnrollmentOffer } from '@hexagonal-monorepo-template/domain';
import { EmployeeEnrollmentPresenter } from './employee-enrollment.presenter';

const offer: SecondFactorEnrollmentOffer = {
  enrollmentId: 'enrollment-1',
  secret: 'JBSWY3DPEHPK3PXP',
  provisioningUri:
    'otpauth://totp/Nexus:alice?secret=JBSWY3DPEHPK3PXP&issuer=Nexus',
};

describe('EmployeeEnrollmentPresenter', () => {
  it('shows the secret in groups of four characters to ease typing it', () => {
    const model = new EmployeeEnrollmentPresenter().present(offer);

    expect(model.secretDisplay).toBe('JBSW Y3DP EHPK 3PXP');
  });

  it('keeps the provisioning uri as it is', () => {
    const model = new EmployeeEnrollmentPresenter().present(offer);

    expect(model.provisioningUri).toBe(offer.provisioningUri);
  });

  it('keeps the last group when the secret is not a multiple of four', () => {
    const model = new EmployeeEnrollmentPresenter().present({
      ...offer,
      secret: 'ABCDEFGHIJ',
    });

    expect(model.secretDisplay).toBe('ABCD EFGH IJ');
  });
});
