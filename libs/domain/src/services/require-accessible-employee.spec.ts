import { Employee } from '../entities/employee';
import { EmployeeStatus } from '../entities/employee-status';
import { ErrorCode } from '../errors/error-code';
import { requireAccessibleEmployee } from './require-accessible-employee';

const alice = new Employee(
  'e1',
  'c1',
  'Alice',
  'Martin',
  EmployeeStatus.ACTIVE,
  null,
);

function employeeStore(employees: readonly Employee[]) {
  return {
    findById: async (id: string): Promise<Employee | null> =>
      employees.find((employee) => employee.id === id) ?? null,
  };
}

describe('requireAccessibleEmployee', () => {
  it('hands back the employee record of the actor company', async () => {
    const store = employeeStore([alice]);

    await expect(
      requireAccessibleEmployee('e1', 'c1', store.findById),
    ).resolves.toBe(alice);
  });

  it('refuses a record owned by another company, as an access denial', async () => {
    const store = employeeStore([alice]);

    await expect(
      requireAccessibleEmployee('e1', 'c2', store.findById),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses a record the store does not know, as an access denial', async () => {
    const store = employeeStore([]);

    await expect(
      requireAccessibleEmployee('e1', 'c1', store.findById),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses an actor not bound to a company', async () => {
    const store = employeeStore([alice]);

    await expect(
      requireAccessibleEmployee('e1', null, store.findById),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
