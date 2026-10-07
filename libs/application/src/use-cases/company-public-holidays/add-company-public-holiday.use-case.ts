import {
  ActorContext,
  AuditAction,
  AuditSubject,
  CalendarDate,
  Company,
  CompanyPublicHoliday,
  CompanySettingsSnapshot,
  PublicHoliday,
  requireAccessibleCompany,
  requirePublicHolidayLabel,
  toCompanySettingsSnapshot,
  toPublicHolidayAuditSnapshot,
} from '@hexagonal-monorepo-template/domain';
import {
  IAddCompanyPublicHoliday,
  IAuditLogRepository,
  IClock,
  ICompanyRepository,
  IIdGenerator,
  IPublicHolidayRepository,
} from '@hexagonal-monorepo-template/ports';

export class AddCompanyPublicHolidayUseCase
  implements IAddCompanyPublicHoliday
{
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
    const company = await this.loadAccessibleCompany(
      input.actor,
      input.companyId,
    );
    const publicHoliday = await this.resolveSharedPublicHoliday(
      input.date,
      input.label,
    );
    const updated = await this.retainOnCalendar(company, publicHoliday);
    await this.recordAddition(input.actor, updated, publicHoliday);
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

  private async resolveSharedPublicHoliday(
    rawDate: string,
    rawLabel: string,
  ): Promise<PublicHoliday> {
    const label = requirePublicHolidayLabel(rawLabel);
    const date = CalendarDate.parse(rawDate);
    const observed = await this.publicHolidays.findByDateAndLabel(date, label);
    if (observed !== null) {
      return observed;
    }

    const publicHoliday = new PublicHoliday(this.ids.next(), date, label);
    await this.publicHolidays.save(publicHoliday);
    return publicHoliday;
  }

  private async retainOnCalendar(
    company: Company,
    publicHoliday: PublicHoliday,
  ): Promise<Company> {
    const updated = company.withCalendar(
      company.calendar.addPublicHoliday(
        new CompanyPublicHoliday(company.id, publicHoliday),
      ),
    );
    await this.companies.save(updated);
    return updated;
  }

  private recordAddition(
    actor: ActorContext,
    company: Company,
    publicHoliday: PublicHoliday,
  ): Promise<void> {
    return this.audits.append({
      id: this.ids.next(),
      companyId: company.id,
      actorId: actor.userId,
      occurredAt: this.clock.now(),
      action: AuditAction.ADDITION,
      subject: AuditSubject.COMPANY_PUBLIC_HOLIDAY,
      before: null,
      after: toPublicHolidayAuditSnapshot(publicHoliday),
    });
  }
}
