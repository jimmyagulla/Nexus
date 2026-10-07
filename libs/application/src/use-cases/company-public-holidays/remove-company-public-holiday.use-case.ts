import {
  ActorContext,
  AuditAction,
  AuditSubject,
  Company,
  CompanySettingsSnapshot,
  PublicHoliday,
  requireAccessibleCompany,
  toCompanySettingsSnapshot,
  toPublicHolidayAuditSnapshot,
} from '@hexagonal-monorepo-template/domain';
import {
  IAuditLogRepository,
  IClock,
  ICompanyRepository,
  IIdGenerator,
  IRemoveCompanyPublicHoliday,
} from '@hexagonal-monorepo-template/ports';

export class RemoveCompanyPublicHolidayUseCase
  implements IRemoveCompanyPublicHoliday
{
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
    const company = await this.loadAccessibleCompany(
      input.actor,
      input.companyId,
    );
    const retained = company.calendar.requirePublicHoliday(
      input.publicHolidayId,
    );
    const updated = await this.dropFromCalendar(
      company,
      input.publicHolidayId,
    );
    await this.recordDeletion(input.actor, updated, retained.publicHoliday);
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

  private async dropFromCalendar(
    company: Company,
    publicHolidayId: string,
  ): Promise<Company> {
    const updated = company.withCalendar(
      company.calendar.removePublicHoliday(publicHolidayId),
    );
    await this.companies.save(updated);
    return updated;
  }

  private recordDeletion(
    actor: ActorContext,
    company: Company,
    publicHoliday: PublicHoliday,
  ): Promise<void> {
    return this.audits.append({
      id: this.ids.next(),
      companyId: company.id,
      actorId: actor.userId,
      occurredAt: this.clock.now(),
      action: AuditAction.DELETION,
      subject: AuditSubject.COMPANY_PUBLIC_HOLIDAY,
      before: toPublicHolidayAuditSnapshot(publicHoliday),
      after: null,
    });
  }
}
