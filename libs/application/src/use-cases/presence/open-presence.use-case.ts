import {
  ActorContext,
  buildPresenceSnapshot,
  Company,
  EmployeeReference,
  ErrorCode,
  PresenceFactSources,
  PresenceMonth,
  PresenceSnapshot,
  proposeWorkedDays,
  requireAccessibleCompany,
  requireEmployerOfCompany,
  selectHoursToProcess,
} from '@hexagonal-monorepo-template/domain';
import {
  IAbsenceFactSource,
  ICompanyRepository,
  IEmployeeDirectory,
  IHoursFactSource,
  IOpenPresence,
  IPresenceRepository,
  ISickLeaveDocumentSource,
} from '@hexagonal-monorepo-template/ports';

export class OpenPresenceUseCase implements IOpenPresence {
  constructor(
    private readonly companies: ICompanyRepository,
    private readonly employees: IEmployeeDirectory,
    private readonly absences: IAbsenceFactSource,
    private readonly sickLeaves: ISickLeaveDocumentSource,
    private readonly hours: IHoursFactSource,
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
    const company = await this.loadCompany(input.actor, input.companyId);
    const employee = await this.requireEmployeeOfCompany(
      input.companyId,
      input.employeeId,
    );
    await this.requireMonthNotYetOpened(employee, month);
    const presence = await this.presences.insert({
      companyId: input.companyId,
      employeeId: input.employeeId,
      month,
      workedDays: await this.proposeWorkedDays(company, employee, month),
    });
    await this.processValidatedHours(employee, month);
    return buildPresenceSnapshot(presence, employee, this.factSources());
  }

  private async processValidatedHours(
    employee: EmployeeReference,
    month: PresenceMonth,
  ): Promise<void> {
    const facts = await this.hours.listForEmployee(
      employee.companyId,
      employee.id,
    );
    const toProcess = selectHoursToProcess(month, facts);
    if (toProcess.length > 0) {
      await this.hours.markProcessed(
        employee.companyId,
        toProcess.map((fact) => fact.id),
      );
    }
  }

  private loadCompany(actor: ActorContext, companyId: string): Promise<Company> {
    return requireAccessibleCompany(companyId, actor.companyId, (id) =>
      this.companies.findById(id),
    );
  }

  private async proposeWorkedDays(
    company: Company,
    employee: EmployeeReference,
    month: PresenceMonth,
  ): Promise<number> {
    const absences = await this.absences.listForEmployee(
      company.id,
      employee.id,
    );
    return proposeWorkedDays(month, company.calendar, absences);
  }

  private factSources(): PresenceFactSources {
    return {
      absences: this.absences,
      sickLeaves: this.sickLeaves,
      hours: this.hours,
    };
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
