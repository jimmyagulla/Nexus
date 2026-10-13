import { Employee, EmployeeStatus } from './employee';

describe('Employee', () => {
  it('is open to new requests while active', () => {
    expect(new Employee('e1', 'c1', EmployeeStatus.ACTIVE).isActive()).toBe(
      true,
    );
  });

  it('is closed to new requests once inactive', () => {
    expect(new Employee('e1', 'c1', EmployeeStatus.INACTIVE).isActive()).toBe(
      false,
    );
  });
});
