import {
  ActorContext,
  AuditAction,
  AuditSubject,
  Company,
  CompanyName,
  CompanySettingsSnapshot,
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
    const company = await this.loadAccessibleCompany(
      input.actor,
      input.companyId,
    );
    const renamed = await this.applyName(company, input.name);
    await this.recordRename(input.actor, company, renamed);
    return toCompanySettingsSnapshot(renamed);
  }

  private loadAccessibleCompany(
    actor: ActorContext,
    companyId: string,
  ): Promise<Company> {
    return requireAccessibleCompany(companyId, actor.companyId, (id) =>
      this.companies.findById(id),
    );
  }

  private async applyName(company: Company, name: string): Promise<Company> {
    const renamed = company.rename(CompanyName.parse(name));
    await this.companies.save(renamed);
    return renamed;
  }

  private recordRename(
    actor: ActorContext,
    before: Company,
    after: Company,
  ): Promise<void> {
    return this.audits.append({
      id: this.ids.next(),
      companyId: after.id,
      actorId: actor.userId,
      occurredAt: this.clock.now(),
      action: AuditAction.MODIFICATION,
      subject: AuditSubject.COMPANY_NAME,
      before: { companyName: before.name.value },
      after: { companyName: after.name.value },
    });
  }
}
