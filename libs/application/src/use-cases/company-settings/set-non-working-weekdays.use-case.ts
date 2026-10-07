import {
  ActorContext,
  AuditAction,
  AuditSubject,
  Company,
  CompanySettingsSnapshot,
  DayOfWeek,
  requireAccessibleCompany,
  toCompanySettingsSnapshot,
} from '@hexagonal-monorepo-template/domain';
import {
  IAuditLogRepository,
  IClock,
  ICompanyRepository,
  IIdGenerator,
  ISetNonWorkingWeekdays,
} from '@hexagonal-monorepo-template/ports';

export class SetNonWorkingWeekdaysUseCase implements ISetNonWorkingWeekdays {
  constructor(
    private readonly companies: ICompanyRepository,
    private readonly audits: IAuditLogRepository,
    private readonly ids: IIdGenerator,
    private readonly clock: IClock,
  ) {}

  async execute(input: {
    actor: ActorContext;
    companyId: string;
    weekdays: readonly DayOfWeek[];
  }): Promise<CompanySettingsSnapshot> {
    const company = await this.loadAccessibleCompany(
      input.actor,
      input.companyId,
    );
    const updated = await this.applyWeekdays(company, input.weekdays);
    await this.recordWeekdayChange(input.actor, company, updated);
    return toCompanySettingsSnapshot(updated);
  }

  private loadAccessibleCompany(
    actor: ActorContext,
    companyId: string,
  ): Promise<Company> {
    return requireAccessibleCompany(companyId, actor.companyId, (id) =>
      this.companies.findById(id),
    );
  }

  private async applyWeekdays(
    company: Company,
    weekdays: readonly DayOfWeek[],
  ): Promise<Company> {
    const updated = company.withCalendar(
      company.calendar.withNonWorkingWeekdays(weekdays),
    );
    await this.companies.save(updated);
    return updated;
  }

  private recordWeekdayChange(
    actor: ActorContext,
    before: Company,
    after: Company,
  ): Promise<void> {
    return this.audits.append({
      id: this.ids.next(),
      companyId: after.id,
      actorId: actor.userId,
      occurredAt: this.clock.now(),
      action: AuditAction.MODIFICATION,
      subject: AuditSubject.COMPANY_NON_WORKING_WEEKDAY,
      before: { daysOfWeek: before.calendar.nonWorkingWeekdays },
      after: { daysOfWeek: after.calendar.nonWorkingWeekdays },
    });
  }
}
