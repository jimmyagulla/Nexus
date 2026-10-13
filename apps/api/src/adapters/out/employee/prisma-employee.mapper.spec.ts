import { describe, expect, it } from 'vitest';
import { EmployeeStatus } from '@hexagonal-monorepo-template/domain';
import { PrismaEmployeeRow, toEmployee } from './prisma-employee.mapper';

function rowOf(overrides: Partial<PrismaEmployeeRow> = {}): PrismaEmployeeRow {
  return {
    id: 'employee-1',
    companyId: 'company-1',
    firstName: 'Alice',
    lastName: 'Martin',
    status: EmployeeStatus.ACTIVE,
    lastActivityAt: null,
    ...overrides,
  };
}

describe('toEmployee', () => {
  it('maps a prisma row to an active employee record', () => {
    const employee = toEmployee(rowOf());

    expect(employee.id).toBe('employee-1');
    expect(employee.companyId).toBe('company-1');
    expect(employee.firstName).toBe('Alice');
    expect(employee.lastName).toBe('Martin');
    expect(employee.status).toBe(EmployeeStatus.ACTIVE);
    expect(employee.lastActivityAt).toBeNull();
  });

  it('keeps the last activity of the record', () => {
    const at = new Date('2026-10-06T10:00:00.000Z');

    expect(toEmployee(rowOf({ lastActivityAt: at })).lastActivityAt).toEqual(at);
  });

  it('keeps an inactive status', () => {
    expect(
      toEmployee(rowOf({ status: EmployeeStatus.INACTIVE })).isActive(),
    ).toBe(false);
  });
});
