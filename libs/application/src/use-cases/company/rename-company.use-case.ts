import {
  ActorContext,
  AuditAction,
  AuditSubject,
  CompanySettingsSnapshot,
  CompanyName,
  requireAccessibleCompany,
  toCompanySettingsSnapshot,
} from '@hexagonal-monorepo-template/domain';
import {
  IAuditLogRepository,
  IClock,
  ICompanyRepository,
  IIdGenerator,
  IRenameCompany,
} from '@hexagonal-monorepo-template/ports';

export class RenameCompanyUseCase implements IRenameCompany {
  constructor(
    private readonly companies: ICompanyRepository,
    private readonly audits: IAuditLogRepository,
    private readonly ids: IIdGenerator,
    private readonly clock: IClock,
  ) {}

  async execute(input: {
    actor: ActorContext;
    companyId: string;
    name: string;
  }): Promise<CompanySettingsSnapshot> {
    const company = await requireAccessibleCompany(
      input.companyId,
      input.actor.companyId,
      (id) => this.companies.findById(id),
    );
    const next = company.rename(CompanyName.parse(input.name));
    await this.companies.save(next);
    await this.audits.append({
      id: this.ids.next(),
      companyId: company.id,
      actorId: input.actor.userId,
      occurredAt: this.clock.now(),
      action: AuditAction.MODIFICATION,
      subject: AuditSubject.COMPANY_NAME,
      before: { companyName: company.name.value },
      after: { companyName: next.name.value },
    });
    return toCompanySettingsSnapshot(next);
  }
}
