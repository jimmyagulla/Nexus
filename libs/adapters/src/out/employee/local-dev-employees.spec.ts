import { describe, expect, it } from 'vitest';
import { LOCAL_DEV_COMPANY_ID } from '../session/local-dev-session';
import { localDevEmployees } from './local-dev-employees';

describe('localDevEmployees', () => {
  it('offers employees of the local development company', () => {
    const employees = localDevEmployees();

    expect(employees.length).toBeGreaterThan(0);
    expect(
      employees.every((employee) => employee.companyId === LOCAL_DEV_COMPANY_ID),
    ).toBe(true);
  });

  it('gives each employee its own identity', () => {
    const ids = localDevEmployees().map((employee) => employee.id);

    expect(new Set(ids).size).toBe(ids.length);
  });
});
