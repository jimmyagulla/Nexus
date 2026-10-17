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

const acme: CompanySettingsSnapshot = {
  id: 'c1',
  name: 'Acme',
  nonWorkingWeekdays: [],
  publicHolidays: [],
};

function useCaseFor(
  session: InMemorySessionGateway,
): RenameCompanyFromSessionUseCase {
  return new RenameCompanyFromSessionUseCase(
    session,
    new InMemoryCompanySettingsGateway(new Map([['c1', acme]])),
  );
}

describe('RenameCompanyFromSessionUseCase', () => {
  it('renames the company of the signed-in actor', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway('token', actor));

    await expect(useCase.execute('Nexus')).resolves.toEqual({ ...acme, name: 'Nexus' });
  });

  it('refuses when the session carries no company', async () => {
    const useCase = useCaseFor(
      new InMemorySessionGateway('token', { ...actor, companyId: null }),
    );

    await expect(useCase.execute('Nexus')).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });

  it('refuses when the session carries no token', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway(null, actor));

    await expect(useCase.execute('Nexus')).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });

  it('refuses when there is no session at all', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway(null, null));

    await expect(useCase.execute('Nexus')).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });
});
