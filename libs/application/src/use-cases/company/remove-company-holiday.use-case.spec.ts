import { describe, expect, it } from 'vitest';
import {
  AuditAction,
  AuditSubject,
  holidayValue,
} from '@hexagonal-monorepo-template/domain';
import {
  InMemoryAuditLogRepository,
  InMemoryCompanyRepository,
} from '@hexagonal-monorepo-template/adapters';
import { AddCompanyHolidayUseCase } from './add-company-holiday.use-case';
import { CreateCompanyUseCase } from './create-company.use-case';
import { RemoveCompanyHolidayUseCase } from './remove-company-holiday.use-case';

describe('RemoveCompanyHolidayUseCase', () => {
  it('records a typed deletion when a holiday is removed', async () => {
    const companies = new InMemoryCompanyRepository();
    const audit = new InMemoryAuditLogRepository();
    const created = await new CreateCompanyUseCase(companies).execute('Acme');
    const withHoliday = await new AddCompanyHolidayUseCase(
      companies,
      audit,
    ).execute({
      companyId: created.id,
      actorCompanyId: created.id,
      date: '2026-07-14',
      label: 'Fête nationale',
    });
    const holidayId = withHoliday.holidays[0]?.id ?? '';

    await new RemoveCompanyHolidayUseCase(companies, audit).execute({
      companyId: created.id,
      actorCompanyId: created.id,
      holidayId,
    });

    const removal = audit.entries[1];
    expect(removal?.action).toBe(AuditAction.DELETION);
    expect(removal?.subject).toBe(AuditSubject.COMPANY_CALENDAR_HOLIDAY);
    expect(removal?.before).toEqual(
      holidayValue({
        id: holidayId,
        date: '2026-07-14',
        label: 'Fête nationale',
      }),
    );
    expect(removal?.after).toBeNull();
  });
});
