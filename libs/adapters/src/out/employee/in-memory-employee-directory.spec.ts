import { describe, expect, it } from 'vitest';
import { EmployeeReference } from '@hexagonal-monorepo-template/domain';
import { InMemoryEmployeeDirectory } from './in-memory-employee-directory';

const camille: EmployeeReference = {
  id: 'e1',
  companyId: 'c1',
  fullName: 'Camille Martin',
};
const dominique: EmployeeReference = {
  id: 'e2',
  companyId: 'c2',
  fullName: 'Dominique Durand',
};

describe('InMemoryEmployeeDirectory', () => {
  it('finds an employee of the company', async () => {
    const directory = new InMemoryEmployeeDirectory([camille, dominique]);

    expect(await directory.findInCompany('c1', 'e1')).toEqual(camille);
  });

  it('finds nothing for an employee of another company', async () => {
    const directory = new InMemoryEmployeeDirectory([camille, dominique]);

    expect(await directory.findInCompany('c1', 'e2')).toBeNull();
  });

  it('finds nothing for an unknown employee', async () => {
    const directory = new InMemoryEmployeeDirectory([camille]);

    expect(await directory.findInCompany('c1', 'e9')).toBeNull();
  });

  it('lists the employees of one company only', async () => {
    const directory = new InMemoryEmployeeDirectory([camille, dominique]);

    expect(await directory.listInCompany('c1')).toEqual([camille]);
  });

  it('lists nothing when no employee is known', async () => {
    const directory = new InMemoryEmployeeDirectory();

    expect(await directory.listInCompany('c1')).toEqual([]);
  });
});
