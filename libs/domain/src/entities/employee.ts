import { EmployeeStatus } from './employee-status';

export class Employee {
  constructor(
    readonly id: string,
    readonly companyId: string,
    readonly firstName: string,
    readonly lastName: string,
    readonly status: EmployeeStatus,
    readonly lastActivityAt: Date | null,
  ) {}

  isActive(): boolean {
    return this.status === EmployeeStatus.ACTIVE;
  }
}
