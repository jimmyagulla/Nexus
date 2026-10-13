import { describe, expect, it } from 'vitest';
import { Employee, EmployeeStatus } from '@hexagonal-monorepo-template/domain';
import { InMemoryEmployeeRepository } from './in-memory-employee.repository';

describe('InMemoryEmployeeRepository', () => {
  it('finds an employee of the company', async () => {
    const employee = new Employee('e1', 'c1', EmployeeStatus.ACTIVE);
    const repository = new InMemoryEmployeeRepository([employee]);

    await expect(repository.findById('c1', 'e1')).resolves.toBe(employee);
  });

  it('does not find an employee of another company', async () => {
    const repository = new InMemoryEmployeeRepository([
      new Employee('e1', 'c1', EmployeeStatus.ACTIVE),
    ]);

    await expect(repository.findById('c2', 'e1')).resolves.toBeNull();
  });

  it('does not find an unknown employee', async () => {
    await expect(
      new InMemoryEmployeeRepository().findById('c1', 'e1'),
    ).resolves.toBeNull();
  });
});
