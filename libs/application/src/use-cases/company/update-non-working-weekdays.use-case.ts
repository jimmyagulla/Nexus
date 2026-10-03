import {
  AuditAction,
  AuditSubject,
  Company,
  CompanyCalendar,
  nonWorkingWeekdaysValue,
} from '@hexagonal-monorepo-template/domain';
import {
  IAuditLogRepository,
  ICompanyRepository,
  IUpdateNonWorkingWeekdaysInboundPort,
  UpdateNonWorkingWeekdaysCommand,
} from '@hexagonal-monorepo-template/ports';
import { appendCompanyAudit } from './append-company-audit';
import { requireAccessibleCompany } from './company-access';

export class UpdateNonWorkingWeekdaysUseCase
  implements IUpdateNonWorkingWeekdaysInboundPort
{
  constructor(
    private readonly companies: ICompanyRepository,
    private readonly auditLog: IAuditLogRepository,
  ) {}

  async execute(command: UpdateNonWorkingWeekdaysCommand): Promise<Company> {
    const current = await requireAccessibleCompany(
      command.companyId,
      command.actorCompanyId,
      this.companies,
    );
    const updated = CompanyCalendar.setNonWorkingWeekdays(
      current,
      command.weekdays,
    );
    await this.companies.save(updated);
    await appendCompanyAudit(
      this.auditLog,
      updated.id,
      AuditAction.MODIFICATION,
      AuditSubject.COMPANY_CALENDAR_NON_WORKING_WEEKDAYS,
      nonWorkingWeekdaysValue([...current.nonWorkingWeekdays]),
      nonWorkingWeekdaysValue([...updated.nonWorkingWeekdays]),
    );
    return updated;
  }
}
