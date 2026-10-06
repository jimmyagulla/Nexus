import {
  ActorContext,
  AuditAction,
  AuditSubject,
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
    const company = await requireAccessibleCompany(
      input.companyId,
      input.actor.companyId,
      (id) => this.companies.findById(id),
    );
    const next = company.withCalendar(
      company.calendar.withNonWorkingWeekdays(input.weekdays),
    );
    await this.companies.save(next);
    await this.audits.append({
      id: this.ids.next(),
      companyId: company.id,
      actorId: input.actor.userId,
      occurredAt: this.clock.now(),
      action: AuditAction.MODIFICATION,
      subject: AuditSubject.COMPANY_NON_WORKING_WEEKDAY,
      before: { daysOfWeek: company.calendar.nonWorkingWeekdays },
      after: { daysOfWeek: next.calendar.nonWorkingWeekdays },
    });
    return toCompanySettingsSnapshot(next);
  }
}
