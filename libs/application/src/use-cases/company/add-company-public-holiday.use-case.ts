import {
  ActorContext,
  AuditAction,
  AuditSubject,
  CalendarDate,
  CompanyPublicHoliday,
  CompanySettingsSnapshot,
  ErrorCode,
  PublicHoliday,
  requireAccessibleCompany,
  toCompanySettingsSnapshot,
} from '@hexagonal-monorepo-template/domain';
import {
  IAddCompanyPublicHoliday,
  IAuditLogRepository,
  IClock,
  ICompanyRepository,
  IIdGenerator,
  IPublicHolidayRepository,
} from '@hexagonal-monorepo-template/ports';

export class AddCompanyPublicHolidayUseCase implements IAddCompanyPublicHoliday {
  constructor(
    private readonly companies: ICompanyRepository,
    private readonly publicHolidays: IPublicHolidayRepository,
    private readonly audits: IAuditLogRepository,
    private readonly ids: IIdGenerator,
    private readonly clock: IClock,
  ) {}

  async execute(input: {
    actor: ActorContext;
    companyId: string;
    date: string;
    label: string;
  }): Promise<CompanySettingsSnapshot> {
    const company = await requireAccessibleCompany(
      input.companyId,
      input.actor.companyId,
      (id) => this.companies.findById(id),
    );
    const label = input.label.trim();
    if (label === '') {
      throw new Error(ErrorCode.REQUIRED_INFORMATION);
    }
    const date = CalendarDate.parse(input.date);
    const existing = await this.publicHolidays.findByDateAndLabel(date, label);
    const publicHoliday =
      existing ?? new PublicHoliday(this.ids.next(), date, label);
    if (existing === null) {
      await this.publicHolidays.save(publicHoliday);
    }
    const retained = new CompanyPublicHoliday(company.id, publicHoliday);
    const next = company.withCalendar(
      company.calendar.addPublicHoliday(retained),
    );
    await this.companies.save(next);
    await this.audits.append({
      id: this.ids.next(),
      companyId: company.id,
      actorId: input.actor.userId,
      occurredAt: this.clock.now(),
      action: AuditAction.ADDITION,
      subject: AuditSubject.COMPANY_PUBLIC_HOLIDAY,
      before: null,
      after: {
        publicHolidayId: publicHoliday.id,
        holidayDate: date.value,
        holidayLabel: label,
      },
    });
    return toCompanySettingsSnapshot(next);
  }
}
