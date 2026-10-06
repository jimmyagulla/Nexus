import {
  FixedClock,
  InMemoryAuditLogRepository,
  InMemoryCompanyRepository,
  SequentialIdGenerator,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  AuditAction,
  AuditSubject,
  Company,
  CompanyName,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { RenameCompanyUseCase } from './rename-company.use-case';

const actor: ActorContext = {
  userId: 'user-1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

const now = new Date('2026-10-06T10:00:00.000Z');

describe('RenameCompanyUseCase', () => {
  it('renames the company and records before and after', async () => {
    const companies = new InMemoryCompanyRepository();
    const audits = new InMemoryAuditLogRepository();
    await companies.save(Company.create('c1', CompanyName.parse('Acme')));

    const settings = await new RenameCompanyUseCase(
      companies,
      audits,
      new SequentialIdGenerator(),
      new FixedClock(now),
    ).execute({ actor, companyId: 'c1', name: 'Nexus' });

    expect(settings.name).toBe('Nexus');
    expect((await companies.findById('c1'))?.name.value).toBe('Nexus');
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

  it('refuses a blank name and leaves the company untouched', async () => {
    const companies = new InMemoryCompanyRepository();
    const audits = new InMemoryAuditLogRepository();
    await companies.save(Company.create('c1', CompanyName.parse('Acme')));
    const useCase = new RenameCompanyUseCase(
      companies,
      audits,
      new SequentialIdGenerator(),
      new FixedClock(now),
    );

    await expect(
      useCase.execute({ actor, companyId: 'c1', name: '   ' }),
    ).rejects.toThrow(ErrorCode.REQUIRED_INFORMATION);
    expect((await companies.findById('c1'))?.name.value).toBe('Acme');
    expect(await audits.listByCompany('c1')).toEqual([]);
  });

  it('refuses an unknown company', async () => {
    const useCase = new RenameCompanyUseCase(
      new InMemoryCompanyRepository(),
      new InMemoryAuditLogRepository(),
      new SequentialIdGenerator(),
      new FixedClock(now),
    );

    await expect(
      useCase.execute({ actor, companyId: 'c1', name: 'Nexus' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses another company', async () => {
    const companies = new InMemoryCompanyRepository();
    await companies.save(Company.create('c2', CompanyName.parse('Other')));
    const useCase = new RenameCompanyUseCase(
      companies,
      new InMemoryAuditLogRepository(),
      new SequentialIdGenerator(),
      new FixedClock(now),
    );

    await expect(
      useCase.execute({ actor, companyId: 'c2', name: 'Nexus' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    expect((await companies.findById('c2'))?.name.value).toBe('Other');
  });
});