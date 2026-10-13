import { describe, expect, it } from 'vitest';
import { Employee, EmployeeStatus } from '@hexagonal-monorepo-template/domain';
import { InMemoryEmployeeRepository } from './in-memory-employee.repository';

function employee(id: string, status: EmployeeStatus = EmployeeStatus.ACTIVE) {
  return new Employee(id, 'c1', 'Alice', 'Martin', status, null);
}

describe('InMemoryEmployeeRepository', () => {
  it('finds an inserted record by its id', async () => {
    const employees = new InMemoryEmployeeRepository();
    const alice = employee('e1');

    await employees.insert(alice);

    expect(await employees.findById('e1')).toEqual(alice);
  });

  it('returns nothing for an unknown id', async () => {
    const employees = new InMemoryEmployeeRepository();

    await employees.insert(employee('e1'));

    expect(await employees.findById('e2')).toBeNull();
  });

  it('keeps the saved record over the previous one', async () => {
    const employees = new InMemoryEmployeeRepository();
    await employees.insert(employee('e1'));
    const inactive = employee('e1', EmployeeStatus.INACTIVE);

    await employees.save(inactive);

    expect(await employees.findById('e1')).toEqual(inactive);
  });
});
