import {
  Account,
  AccountStatus,
  Employee,
  ErrorCode,
  OpenedEmployeeWorkspace,
  SecondFactorEnrollment,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import {
  IAccountRepository,
  IClock,
  IConfirmSecondFactorEnrollment,
  IEmployeeRepository,
  ISecondFactorCodes,
  ISecondFactorEnrollmentRepository,
  ISignInSession,
} from '@hexagonal-monorepo-template/ports';

export class ConfirmSecondFactorEnrollmentUseCase
  implements IConfirmSecondFactorEnrollment
{
  constructor(
    private readonly enrollments: ISecondFactorEnrollmentRepository,
    private readonly accounts: IAccountRepository,
    private readonly employees: IEmployeeRepository,
    private readonly codes: ISecondFactorCodes,
    private readonly sessions: ISignInSession,
    private readonly clock: IClock,
  ) {}

  async execute(input: {
    enrollmentId: string;
    code: string;
  }): Promise<OpenedEmployeeWorkspace> {
    const enrollment = await this.requireEnrollment(input.enrollmentId);
    const account = await this.requireActiveEmployeeAccount(enrollment);
    const employee = await this.requireEmployeeRecord(account);
    await this.requireProvenCode(enrollment, input.code);
    await this.enrollments.save(enrollment.confirm());
    await this.recordActivity(employee);
    return this.openWorkspace(account, employee);
  }

  private async requireEnrollment(
    enrollmentId: string,
  ): Promise<SecondFactorEnrollment> {
    const enrollment = await this.enrollments.findById(enrollmentId);
    if (enrollment === null) {
      throw new Error(ErrorCode.ACCESS_DENIED);
    }
    return enrollment;
  }

  private async requireActiveEmployeeAccount(
    enrollment: SecondFactorEnrollment,
  ): Promise<Account> {
    const account = await this.accounts.findById(enrollment.accountId);
    if (
      account === null ||
      account.role !== UserRole.EMPLOYEE ||
      account.status !== AccountStatus.ACTIVE ||
      account.employeeId === null
    ) {
      throw new Error(ErrorCode.ACCESS_DENIED);
    }
    return account;
  }

  private async requireEmployeeRecord(account: Account): Promise<Employee> {
    const employee =
      account.employeeId === null
        ? null
        : await this.employees.findById(account.employeeId);
    if (employee === null) {
      throw new Error(ErrorCode.ACCESS_DENIED);
    }
    return employee;
  }

  private async requireProvenCode(
    enrollment: SecondFactorEnrollment,
    code: string,
  ): Promise<void> {
    const proven = await this.codes.verify(
      enrollment.secret,
      code,
      this.clock.now(),
    );
    if (!proven) {
      throw new Error(ErrorCode.ACCESS_DENIED);
    }
  }

  private recordActivity(employee: Employee): Promise<void> {
    return this.employees.save(employee.recordActivity(this.clock.now()));
  }

  private async openWorkspace(
    account: Account,
    employee: Employee,
  ): Promise<OpenedEmployeeWorkspace> {
    const session = await this.sessions.open({
      userId: account.identifier.value,
      companyId: account.companyId,
      role: account.role,
    });
    return {
      session,
      employee: {
        id: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
      },
    };
  }
}
