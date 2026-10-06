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
import { RenameCompanyFromSessionUseCase } from './rename-company-from-session.use-case';

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
  ]);
}

describe('RenameCompanyFromSessionUseCase', () => {
  it('renames the company of the signed-in actor', async () => {
    const companySettings = new InMemoryCompanySettingsGateway(
      'token',
      snapshots(),
    );
    const useCase = new RenameCompanyFromSessionUseCase(
      new InMemorySessionGateway('token', actor),
      companySettings,
    );

    const settings = await useCase.execute('Nexus');

    expect(settings.name).toBe('Nexus');
    expect(companySettings.snapshotOf('c1').name).toBe('Nexus');
  });

  it('refuses when the session carries no company', async () => {
    const companySettings = new InMemoryCompanySettingsGateway(
      'token',
      snapshots(),
    );
    const useCase = new RenameCompanyFromSessionUseCase(
      new InMemorySessionGateway('token', { ...actor, companyId: null }),
      companySettings,
    );

    await expect(useCase.execute('Nexus')).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
    expect(companySettings.snapshotOf('c1').name).toBe('Acme');
  });

  it('refuses when the session carries no token', async () => {
    const companySettings = new InMemoryCompanySettingsGateway(
      'token',
      snapshots(),
    );
    const useCase = new RenameCompanyFromSessionUseCase(
      new InMemorySessionGateway(null, actor),
      companySettings,
    );

    await expect(useCase.execute('Nexus')).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
    expect(companySettings.snapshotOf('c1').name).toBe('Acme');
  });

  it('refuses when there is no session at all', async () => {
    const useCase = new RenameCompanyFromSessionUseCase(
      new InMemorySessionGateway(null, null),
      new InMemoryCompanySettingsGateway('token', snapshots()),
    );

    await expect(useCase.execute('Nexus')).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });
});