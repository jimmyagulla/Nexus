import { ErrorCode } from '../errors/error-code';
import { Employee } from './employee';
import { EmployeeStatus } from './employee-status';

function employeeWith(status: EmployeeStatus): Employee {
  return new Employee('employee-1', 'company-1', 'Alice', 'Martin', status, null);
}

describe('Employee', () => {
  it('is open to new actions while active', () => {
    expect(employeeWith(EmployeeStatus.ACTIVE).isActive()).toBe(true);
  });

  it('is closed to new actions once inactive', () => {
    expect(employeeWith(EmployeeStatus.INACTIVE).isActive()).toBe(false);
  });

  it('accepts a new action while active', () => {
    expect(() => employeeWith(EmployeeStatus.ACTIVE).requireActive()).not.toThrow();
  });

  it('refuses a new action once inactive, with the inactive employee refusal', () => {
    expect(() => employeeWith(EmployeeStatus.INACTIVE).requireActive()).toThrow(
      ErrorCode.EMPLOYEE_INACTIVE,
    );
  });

  it('records the last activity of the employee', () => {
    const at = new Date('2026-10-13T12:00:00.000Z');

    const active = employeeWith(EmployeeStatus.ACTIVE).recordActivity(at);

    expect(active.lastActivityAt).toEqual(at);
    expect(active.id).toBe('employee-1');
    expect(active.companyId).toBe('company-1');
    expect(active.status).toBe(EmployeeStatus.ACTIVE);
  });

  it('keeps the previous record untouched when recording an activity', () => {
    const original = employeeWith(EmployeeStatus.ACTIVE);

    original.recordActivity(new Date('2026-10-13T12:00:00.000Z'));

    expect(original.lastActivityAt).toBeNull();
  });

  it('keeps the status of an inactive record when recording an activity', () => {
    const inactive = employeeWith(EmployeeStatus.INACTIVE).recordActivity(
      new Date('2026-10-13T12:00:00.000Z'),
    );

    expect(inactive.status).toBe(EmployeeStatus.INACTIVE);
  });
});
