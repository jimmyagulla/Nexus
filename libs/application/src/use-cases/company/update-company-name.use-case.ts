import {
  AuditAction,
  AuditSubject,
  Company,
  companyNameValue,
} from '@hexagonal-monorepo-template/domain';
import {
  IAuditLogRepository,
  ICompanyRepository,
  IUpdateCompanyNameInboundPort,
  UpdateCompanyNameCommand,
} from '@hexagonal-monorepo-template/ports';
import { appendCompanyAudit } from './append-company-audit';
import { requireAccessibleCompany } from './company-access';

export class UpdateCompanyNameUseCase implements IUpdateCompanyNameInboundPort {
  constructor(
    private readonly companies: ICompanyRepository,
    private readonly auditLog: IAuditLogRepository,
  ) {}

  async execute(command: UpdateCompanyNameCommand): Promise<Company> {
    const current = await requireAccessibleCompany(
      command.companyId,
      command.actorCompanyId,
      this.companies,
    );
    const updated = current.rename(command.name);
    await this.companies.save(updated);
    await appendCompanyAudit(
      this.auditLog,
      updated.id,
      AuditAction.MODIFICATION,
      AuditSubject.COMPANY_NAME,
      companyNameValue(current.name),
      companyNameValue(updated.name),
    );
    return updated;
  }
}
