import {
  AuditAction,
  AuditSubject,
  Company,
  CompanyCalendar,
  holidayValue,
} from '@hexagonal-monorepo-template/domain';
import {
  AddCompanyHolidayCommand,
  IAddCompanyHolidayInboundPort,
  IAuditLogRepository,
  ICompanyRepository,
} from '@hexagonal-monorepo-template/ports';
import { appendCompanyAudit } from './append-company-audit';
import { requireAccessibleCompany } from './company-access';

export class AddCompanyHolidayUseCase implements IAddCompanyHolidayInboundPort {
  constructor(
    private readonly companies: ICompanyRepository,
    private readonly auditLog: IAuditLogRepository,
  ) {}

  async execute(command: AddCompanyHolidayCommand): Promise<Company> {
    const current = await requireAccessibleCompany(
      command.companyId,
      command.actorCompanyId,
      this.companies,
    );
    const updated = CompanyCalendar.addHoliday(
      current,
      command.date,
      command.label,
    );
    const holiday = updated.holidays.at(-1);
    await this.companies.save(updated);
    if (holiday !== undefined) {
      await appendCompanyAudit(
        this.auditLog,
        updated.id,
        AuditAction.ADDITION,
        AuditSubject.COMPANY_CALENDAR_HOLIDAY,
        null,
        holidayValue({
          id: holiday.id,
          date: holiday.date,
          label: holiday.label,
        }),
      );
    }
    return updated;
  }
}
