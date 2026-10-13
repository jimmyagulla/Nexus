import { UserRole } from '../identity/user-role';
import { requiresSecondFactor } from './requires-second-factor';

describe('requiresSecondFactor', () => {
  it('requires it from the employee', () => {
    expect(requiresSecondFactor(UserRole.EMPLOYEE)).toBe(true);
  });

  it('does not require it from the employer', () => {
    expect(requiresSecondFactor(UserRole.EMPLOYER)).toBe(false);
  });

  it('does not require it from the accounting firm', () => {
    expect(requiresSecondFactor(UserRole.ACCOUNTANT)).toBe(false);
  });

  it('does not require it from an actor without a role', () => {
    expect(requiresSecondFactor(null)).toBe(false);
  });
});
