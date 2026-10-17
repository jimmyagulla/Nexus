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
import { AddCompanyPublicHolidayFromSessionUseCase } from './add-company-public-holiday-from-session.use-case';

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
): AddCompanyPublicHolidayFromSessionUseCase {
  return new AddCompanyPublicHolidayFromSessionUseCase(
    session,
    new InMemoryCompanyPublicHolidaysGateway(
      new RandomUuidGenerator(),
      new Map([['c1', acme]]),
    ),
  );
}

describe('AddCompanyPublicHolidayFromSessionUseCase', () => {
  it('retains the public holiday on the company of the signed-in actor', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway('token', actor));

    await expect(
      useCase.execute({ date: '2026-07-14', label: 'Bastille Day' }),
    ).resolves.toEqual({
      ...acme,
      publicHolidays: [
        { id: expect.any(String), date: '2026-07-14', label: 'Bastille Day' },
      ],
    });
  });

  it('refuses when the session carries no company', async () => {
    const useCase = useCaseFor(
      new InMemorySessionGateway('token', { ...actor, companyId: null }),
    );

    await expect(
      useCase.execute({ date: '2026-07-14', label: 'Bastille Day' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses when the session carries no token', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway(null, actor));

    await expect(
      useCase.execute({ date: '2026-07-14', label: 'Bastille Day' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
