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
  IPublicHolidayRepository,
} from '@hexagonal-monorepo-template/ports';

export class AddCompanyPublicHolidayUseCase
  implements IAddCompanyPublicHoliday
{
  constructor(
    private readonly companies: ICompanyRepository,
    private readonly publicHolidays: IPublicHolidayRepository,
    private readonly audits: IAuditLogRepository,
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
    const publicHoliday = await this.findOrCreateSharedPublicHoliday(
      input.date,
      input.label,
    );
    const updated = await this.addPublicHolidayToCompanyCalendar(
      company,
      publicHoliday,
    );
    await this.recordPublicHolidayAddition(
      input.actor,
      updated,
      publicHoliday,
    );
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

  /**
   * Public holidays live in one catalog shared by every company.
   * Returns the entry already stored for this date and label, or registers a new one.
   */
  private async findOrCreateSharedPublicHoliday(
    rawDate: string,
    rawLabel: string,
  ): Promise<PublicHoliday> {
    const label = requirePublicHolidayLabel(rawLabel);
    const date = CalendarDate.parse(rawDate);
    const observed = await this.publicHolidays.findByDateAndLabel(date, label);
    if (observed !== null) {
      return observed;
    }

    return this.publicHolidays.insert(date, label);
  }

  private async addPublicHolidayToCompanyCalendar(
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

  private recordPublicHolidayAddition(
    actor: ActorContext,
    company: Company,
    publicHoliday: PublicHoliday,
  ): Promise<void> {
    return this.audits.append({
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
