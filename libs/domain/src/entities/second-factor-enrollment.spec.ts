import { ErrorCode } from '../errors/error-code';
import { SecondFactorEnrollment } from './second-factor-enrollment';
import { SecondFactorEnrollmentStatus } from './second-factor-enrollment-status';

describe('SecondFactorEnrollment', () => {
  it('starts pending for the account, with the secret to enrol', () => {
    const enrollment = SecondFactorEnrollment.start(
      'enrollment-1',
      'account-1',
      'JBSWY3DPEHPK3PXP',
    );

    expect(enrollment.id).toBe('enrollment-1');
    expect(enrollment.accountId).toBe('account-1');
    expect(enrollment.secret).toBe('JBSWY3DPEHPK3PXP');
    expect(enrollment.status).toBe(SecondFactorEnrollmentStatus.PENDING);
    expect(enrollment.isConfirmed()).toBe(false);
  });

  it('refuses to start without a secret', () => {
    expect(() =>
      SecondFactorEnrollment.start('enrollment-1', 'account-1', '   '),
    ).toThrow(ErrorCode.REQUIRED_INFORMATION);
  });
});
