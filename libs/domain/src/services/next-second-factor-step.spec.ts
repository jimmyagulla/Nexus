import { UserRole } from '../identity/user-role';
import {
  nextSecondFactorStep,
  SecondFactorStep,
} from './next-second-factor-step';

describe('nextSecondFactorStep', () => {
  it('sends an employee who is not enrolled to the enrollment', () => {
    expect(
      nextSecondFactorStep({
        role: UserRole.EMPLOYEE,
        enrolled: false,
        verified: false,
      }),
    ).toBe(SecondFactorStep.ENROLL);
  });

  it('asks an enrolled employee for the second factor', () => {
    expect(
      nextSecondFactorStep({
        role: UserRole.EMPLOYEE,
        enrolled: true,
        verified: false,
      }),
    ).toBe(SecondFactorStep.VERIFY);
  });

  it('opens the space of an employee whose second factor is verified', () => {
    expect(
      nextSecondFactorStep({
        role: UserRole.EMPLOYEE,
        enrolled: true,
        verified: true,
      }),
    ).toBe(SecondFactorStep.NONE);
  });

  it.each([UserRole.EMPLOYER, UserRole.ACCOUNTANT, null])(
    'asks nothing from the role %s',
    (role) => {
      expect(
        nextSecondFactorStep({ role, enrolled: false, verified: false }),
      ).toBe(SecondFactorStep.NONE);
    },
  );
});
