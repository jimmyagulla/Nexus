import { describe, expect, it } from 'vitest';
import { Weekday } from '@hexagonal-monorepo-template/domain';
import {
  InMemoryAuditLogRepository,
  InMemoryCompanyRepository,
} from '@hexagonal-monorepo-template/adapters';
import { CreateCompanyUseCase } from './create-company.use-case';
import { UpdateCompanySettingsUseCase } from './update-company-settings.use-case';

describe('UpdateCompanySettingsUseCase', () => {
  it('records calendar history when a holiday is removed', async () => {
    const companies = new InMemoryCompanyRepository();
    const audit = new InMemoryAuditLogRepository();
    const created = await new CreateCompanyUseCase(companies).execute('Acme');
    const updater = new UpdateCompanySettingsUseCase(companies, audit);
    const withHoliday = await updater.addHoliday({
      companyId: created.id,
      actorCompanyId: created.id,
      date: '2026-07-14',
      label: 'Fête nationale',
    });
    const holidayId = withHoliday.holidays[0]?.id ?? '';

    await updater.removeHoliday({
      companyId: created.id,
      actorCompanyId: created.id,
      holidayId,
    });

    expect(audit.entries).toHaveLength(2);
    expect(audit.entries[1]?.before).toContain('Fête nationale');
    expect(audit.entries[1]?.after).toBeNull();
  });

  it('updates non-working weekdays', async () => {
    const companies = new InMemoryCompanyRepository();
    const audit = new InMemoryAuditLogRepository();
    const created = await new CreateCompanyUseCase(companies).execute('Acme');
    const updated = await new UpdateCompanySettingsUseCase(
      companies,
      audit,
    ).updateNonWorkingWeekdays({
      companyId: created.id,
      actorCompanyId: created.id,
      weekdays: [Weekday.FRIDAY],
    });

    expect(updated.nonWorkingWeekdays).toEqual([Weekday.FRIDAY]);
  });
});
