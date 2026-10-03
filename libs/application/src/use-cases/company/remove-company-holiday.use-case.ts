import {
  AuditAction,
  AuditSubject,
  Company,
  CompanyCalendar,
  holidayValue,
} from '@hexagonal-monorepo-template/domain';
import {
  IAuditLogRepository,
  ICompanyRepository,
  IRemoveCompanyHolidayInboundPort,
  RemoveCompanyHolidayCommand,
} from '@hexagonal-monorepo-template/ports';
import { appendCompanyAudit } from './append-company-audit';
import { requireAccessibleCompany } from './company-access';

export class RemoveCompanyHolidayUseCase
  implements IRemoveCompanyHolidayInboundPort
{
  constructor(
    private readonly companies: ICompanyRepository,
    private readonly auditLog: IAuditLogRepository,
  ) {}

  async execute(command: RemoveCompanyHolidayCommand): Promise<Company> {
    const current = await requireAccessibleCompany(
      command.companyId,
      command.actorCompanyId,
      this.companies,
    );
    const existing = current.holidays.find(
      (holiday) => holiday.id === command.holidayId,
    );
    const updated = CompanyCalendar.removeHoliday(current, command.holidayId);
    await this.companies.save(updated);
    if (existing !== undefined) {
      await appendCompanyAudit(
        this.auditLog,
        updated.id,
        AuditAction.DELETION,
        AuditSubject.COMPANY_CALENDAR_HOLIDAY,
        holidayValue({
          id: existing.id,
          date: existing.date,
          label: existing.label,
        }),
        null,
      );
    }
    return updated;
  }
}
