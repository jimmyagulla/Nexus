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
  IUpdateCompanyHolidayInboundPort,
  UpdateCompanyHolidayCommand,
} from '@hexagonal-monorepo-template/ports';
import { appendCompanyAudit } from './append-company-audit';
import { requireAccessibleCompany } from './company-access';

export class UpdateCompanyHolidayUseCase
  implements IUpdateCompanyHolidayInboundPort
{
  constructor(
    private readonly companies: ICompanyRepository,
    private readonly auditLog: IAuditLogRepository,
  ) {}

  async execute(command: UpdateCompanyHolidayCommand): Promise<Company> {
    const current = await requireAccessibleCompany(
      command.companyId,
      command.actorCompanyId,
      this.companies,
    );
    const existing = current.holidays.find(
      (holiday) => holiday.id === command.holidayId,
    );
    if (existing === undefined) {
      return current;
    }
    const updated = CompanyCalendar.updateHoliday(
      current,
      command.holidayId,
      command.date,
      command.label,
    );
    await this.companies.save(updated);
    await appendCompanyAudit(
      this.auditLog,
      updated.id,
      AuditAction.MODIFICATION,
      AuditSubject.COMPANY_CALENDAR_HOLIDAY,
      holidayValue({
        id: existing.id,
        date: existing.date,
        label: existing.label,
      }),
      holidayValue({
        id: existing.id,
        date: command.date,
        label: command.label,
      }),
    );
    return updated;
  }
}
