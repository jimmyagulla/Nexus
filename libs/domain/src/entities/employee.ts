import { ErrorCode } from '../errors/error-code';
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

  requireActive(): void {
    if (!this.isActive()) {
      throw new Error(ErrorCode.EMPLOYEE_INACTIVE);
    }
  }

  recordActivity(at: Date): Employee {
    return new Employee(
      this.id,
      this.companyId,
      this.firstName,
      this.lastName,
      this.status,
      at,
    );
  }
}
