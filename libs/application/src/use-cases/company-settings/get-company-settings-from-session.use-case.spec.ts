import {
  InMemoryCompanySettingsGateway,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  CompanySettingsSnapshot,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { GetCompanySettingsFromSessionUseCase } from './get-company-settings-from-session.use-case';

const actor: ActorContext = {
  userId: 'user-1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

function snapshots(): Map<string, CompanySettingsSnapshot> {
  return new Map([
    [
      'c1',
      { id: 'c1', name: 'Acme', nonWorkingWeekdays: [], publicHolidays: [] },
    ],
    [
      'c2',
      { id: 'c2', name: 'Other', nonWorkingWeekdays: [], publicHolidays: [] },
    ],
  ]);
}

describe('GetCompanySettingsFromSessionUseCase', () => {
  it('loads the settings of the company carried by the session', async () => {
    const useCase = new GetCompanySettingsFromSessionUseCase(
      new InMemorySessionGateway('token', actor),
      new InMemoryCompanySettingsGateway('token', snapshots()),
    );

    await expect(useCase.execute()).resolves.toEqual({
      id: 'c1',
      name: 'Acme',
      nonWorkingWeekdays: [],
      publicHolidays: [],
    });
  });

  it('refuses when the session carries no company', async () => {
    const useCase = new GetCompanySettingsFromSessionUseCase(
      new InMemorySessionGateway('token', { ...actor, companyId: null }),
      new InMemoryCompanySettingsGateway('token', snapshots()),
    );

    await expect(useCase.execute()).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses when the session carries no token', async () => {
    const useCase = new GetCompanySettingsFromSessionUseCase(
      new InMemorySessionGateway(null, actor),
      new InMemoryCompanySettingsGateway('token', snapshots()),
    );

    await expect(useCase.execute()).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses when there is no session at all', async () => {
    const useCase = new GetCompanySettingsFromSessionUseCase(
      new InMemorySessionGateway(null, null),
      new InMemoryCompanySettingsGateway('token', snapshots()),
    );

    await expect(useCase.execute()).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});