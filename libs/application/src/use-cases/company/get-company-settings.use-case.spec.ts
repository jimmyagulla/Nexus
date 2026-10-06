import {
  ActorContext,
  Company,
  CompanyName,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { MemoryCompanyRepository } from './memory';
import { GetCompanySettingsUseCase } from './get-company-settings.use-case';

describe('GetCompanySettingsUseCase', () => {
  it('returns the recorded name and calendar', async () => {
    const companies = new MemoryCompanyRepository();
    const company = Company.create('c1', CompanyName.parse('Acme'));
    await companies.save(company);
    const actor: ActorContext = {
      userId: 'user-1',
      companyId: 'c1',
      role: UserRole.EMPLOYER,
    };

    const settings = await new GetCompanySettingsUseCase(companies).execute({
      actor,
      companyId: 'c1',
    });

    expect(settings).toEqual({
      id: 'c1',
      name: 'Acme',
      nonWorkingWeekdays: company.calendar.nonWorkingWeekdays,
      publicHolidays: [],
    });
  });

  it('refuses another company like an unknown company', async () => {
    const companies = new MemoryCompanyRepository();
    await companies.save(Company.create('c1', CompanyName.parse('Acme')));
    const actor: ActorContext = {
      userId: 'user-2',
      companyId: 'c2',
      role: UserRole.EMPLOYER,
    };
    const useCase = new GetCompanySettingsUseCase(companies);

    await expect(
      useCase.execute({ actor, companyId: 'c1' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    await expect(
      useCase.execute({ actor, companyId: 'c2' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
