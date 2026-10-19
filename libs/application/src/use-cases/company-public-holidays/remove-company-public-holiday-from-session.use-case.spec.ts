import {
  InMemoryCompanyPublicHolidaysGateway,
  InMemorySessionGateway,
  RandomUuidGenerator,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  CompanySettingsSnapshot,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { RemoveCompanyPublicHolidayFromSessionUseCase } from './remove-company-public-holiday-from-session.use-case';

const actor: ActorContext = {
  userId: 'user-1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

const acme: CompanySettingsSnapshot = {
  id: 'c1',
  name: 'Acme',
  nonWorkingWeekdays: [],
  publicHolidays: [{ id: 'ph-1', date: '2026-07-14', label: 'Bastille Day' }],
};

function useCaseFor(
  session: InMemorySessionGateway,
): RemoveCompanyPublicHolidayFromSessionUseCase {
  return new RemoveCompanyPublicHolidayFromSessionUseCase(
    session,
    new InMemoryCompanyPublicHolidaysGateway(
      new RandomUuidGenerator(),
      new Map([['c1', acme]]),
    ),
  );
}

describe('RemoveCompanyPublicHolidayFromSessionUseCase', () => {
  it('drops the public holiday from the company of the signed-in actor', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway('token', actor));

    await expect(useCase.execute('ph-1')).resolves.toEqual({
      ...acme,
      publicHolidays: [],
    });
  });

  it('refuses when the session carries no company', async () => {
    const useCase = useCaseFor(
      new InMemorySessionGateway('token', { ...actor, companyId: null }),
    );

    await expect(useCase.execute('ph-1')).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses when the session carries no token', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway(null, actor));

    await expect(useCase.execute('ph-1')).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('surfaces the gateway refusal when the holiday cannot be removed', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway('token', actor));

    await expect(useCase.execute('ph-missing')).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });
});
