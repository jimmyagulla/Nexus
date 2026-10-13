export const EmployeeStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export type EmployeeStatus =
  (typeof EmployeeStatus)[keyof typeof EmployeeStatus];

export class Employee {
  constructor(
    readonly id: string,
    readonly companyId: string,
    readonly status: EmployeeStatus,
  ) {}

  isActive(): boolean {
    return this.status === EmployeeStatus.ACTIVE;
  }
}
