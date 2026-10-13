import { Employee, EmployeeStatus } from '../entities/employee';
import { ErrorCode } from '../errors/error-code';
import { ActorContext } from '../identity/actor-context';
import { UserRole } from '../identity/user-role';
import { requireActiveEmployeeActor } from './require-active-employee-actor';

const actor: ActorContext = {
  userId: 'e1',
  companyId: 'c1',
  role: UserRole.EMPLOYEE,
};

const active = new Employee('e1', 'c1', EmployeeStatus.ACTIVE);

describe('requireActiveEmployeeActor', () => {
  it('returns the active employee acting in her own company', () => {
    expect(requireActiveEmployeeActor(actor, 'c1', active)).toBe(active);
  });

  it('refuses an actor who is not an employee', () => {
    expect(() =>
      requireActiveEmployeeActor(
        { ...actor, role: UserRole.EMPLOYER },
        'c1',
        active,
      ),
    ).toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses another company', () => {
    expect(() => requireActiveEmployeeActor(actor, 'c2', active)).toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });

  it('refuses an inactive employee', () => {
    expect(() =>
      requireActiveEmployeeActor(
        actor,
        'c1',
        new Employee('e1', 'c1', EmployeeStatus.INACTIVE),
      ),
    ).toThrow(ErrorCode.INACTIVE_EMPLOYEE);
  });

  it('refuses an employee that does not exist without saying so', () => {
    expect(() => requireActiveEmployeeActor(actor, 'c1', null)).toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });
});
