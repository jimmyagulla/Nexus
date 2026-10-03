import { describe, expect, it } from 'vitest';
import { Weekday } from '@hexagonal-monorepo-template/domain';
import {
  InMemoryAuditLogRepository,
  InMemoryCompanyRepository,
} from '@hexagonal-monorepo-template/adapters';
import { CreateCompanyUseCase } from './create-company.use-case';
import { UpdateNonWorkingWeekdaysUseCase } from './update-non-working-weekdays.use-case';

describe('UpdateNonWorkingWeekdaysUseCase', () => {
  it('updates non-working weekdays', async () => {
    const companies = new InMemoryCompanyRepository();
    const created = await new CreateCompanyUseCase(companies).execute('Acme');
    const updated = await new UpdateNonWorkingWeekdaysUseCase(
      companies,
      new InMemoryAuditLogRepository(),
    ).execute({
      companyId: created.id,
      actorCompanyId: created.id,
      weekdays: [Weekday.FRIDAY],
    });

    expect(updated.nonWorkingWeekdays).toEqual([Weekday.FRIDAY]);
  });
});
