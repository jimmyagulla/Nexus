import {
  ActorContext,
  AuditAction,
  AuditSubject,
  CompanySettingsSnapshot,
  ErrorCode,
  requireAccessibleCompany,
  toCompanySettingsSnapshot,
} from '@hexagonal-monorepo-template/domain';
import {
  IAuditLogRepository,
  IClock,
  ICompanyRepository,
  IIdGenerator,
  IRemoveCompanyPublicHoliday,
} from '@hexagonal-monorepo-template/ports';

export class RemoveCompanyPublicHolidayUseCase implements IRemoveCompanyPublicHoliday {
  constructor(
    private readonly companies: ICompanyRepository,
    private readonly audits: IAuditLogRepository,
    private readonly ids: IIdGenerator,
    private readonly clock: IClock,
  ) {}

  async execute(input: {
    actor: ActorContext;
    companyId: string;
    publicHolidayId: string;
  }): Promise<CompanySettingsSnapshot> {
    const company = await requireAccessibleCompany(
      input.companyId,
      input.actor.companyId,
      (id) => this.companies.findById(id),
    );
    const current = company.calendar.publicHolidays.find(
      (holiday) => holiday.publicHoliday.id === input.publicHolidayId,
    );
    if (current === undefined) {
      throw new Error(ErrorCode.ACCESS_DENIED);
    }
    const next = company.withCalendar(
      company.calendar.removePublicHoliday(input.publicHolidayId),
    );
    await this.companies.save(next);
    await this.audits.append({
      id: this.ids.next(),
      companyId: company.id,
      actorId: input.actor.userId,
      occurredAt: this.clock.now(),
      action: AuditAction.DELETION,
      subject: AuditSubject.COMPANY_PUBLIC_HOLIDAY,
      before: {
        publicHolidayId: current.publicHoliday.id,
        holidayDate: current.publicHoliday.date.value,
        holidayLabel: current.publicHoliday.label,
      },
      after: null,
    });
    return toCompanySettingsSnapshot(next);
  }
}
