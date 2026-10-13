import {
  ActorContext,
  EmployeeReference,
  ErrorCode,
  PresenceMonth,
  PresenceSnapshot,
  requireEmployerOfCompany,
  toPresenceSnapshot,
} from '@hexagonal-monorepo-template/domain';
import {
  IEmployeeDirectory,
  IOpenPresence,
  IPresenceRepository,
} from '@hexagonal-monorepo-template/ports';

export class OpenPresenceUseCase implements IOpenPresence {
  constructor(
    private readonly employees: IEmployeeDirectory,
    private readonly presences: IPresenceRepository,
  ) {}

  async execute(input: {
    actor: ActorContext;
    companyId: string;
    employeeId: string;
    month: string;
  }): Promise<PresenceSnapshot> {
    requireEmployerOfCompany(input.actor, input.companyId);
    const month = PresenceMonth.parse(input.month);
    const employee = await this.requireEmployeeOfCompany(
      input.companyId,
      input.employeeId,
    );
    await this.requireMonthNotYetOpened(employee, month);
    const presence = await this.presences.insert({
      companyId: input.companyId,
      employeeId: input.employeeId,
      month,
      workedDays: 0,
    });
    return toPresenceSnapshot(presence, employee);
  }

  private async requireEmployeeOfCompany(
    companyId: string,
    employeeId: string,
  ): Promise<EmployeeReference> {
    const employee = await this.employees.findInCompany(companyId, employeeId);
    if (employee === null) {
      throw new Error(ErrorCode.ACCESS_DENIED);
    }
    return employee;
  }

  private async requireMonthNotYetOpened(
    employee: EmployeeReference,
    month: PresenceMonth,
  ): Promise<void> {
    const existing = await this.presences.findByEmployeeAndMonth(
      employee.companyId,
      employee.id,
      month,
    );
    if (existing !== null) {
      throw new Error(ErrorCode.POTENTIAL_DUPLICATE);
    }
  }
}
