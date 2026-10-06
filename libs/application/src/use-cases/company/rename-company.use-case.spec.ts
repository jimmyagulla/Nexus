import {
  ActorContext,
  AuditAction,
  AuditSubject,
  Company,
  CompanyName,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import {
  MemoryClock,
  MemoryAuditLogRepository,
  MemoryCompanyRepository,
  MemoryIds,
} from './memory';
import { RenameCompanyUseCase } from './rename-company.use-case';

describe('RenameCompanyUseCase', () => {
  it('renames the company and records before and after', async () => {
    const companies = new MemoryCompanyRepository();
    const audits = new MemoryAuditLogRepository();
    await companies.save(Company.create('c1', CompanyName.parse('Acme')));
    const actor: ActorContext = {
      userId: 'user-1',
      companyId: 'c1',
      role: UserRole.EMPLOYER,
    };
    const now = new Date('2026-10-06T10:00:00.000Z');

    const settings = await new RenameCompanyUseCase(
      companies,
      audits,
      new MemoryIds(),
      new MemoryClock(now),
    ).execute({ actor, companyId: 'c1', name: 'Nexus' });

    expect(settings.name).toBe('Nexus');
    expect(await audits.listByCompany('c1')).toEqual([
      {
        id: 'id-1',
        companyId: 'c1',
        actorId: 'user-1',
        occurredAt: now,
        action: AuditAction.MODIFICATION,
        subject: AuditSubject.COMPANY_NAME,
        before: { companyName: 'Acme' },
        after: { companyName: 'Nexus' },
      },
    ]);
  });
});
