import {
  ApiCompanyPublicHolidaysGateway,
  InMemoryHttpClient,
  InMemorySessionGateway,
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

const retained: CompanySettingsSnapshot = {
  id: 'c1',
  name: 'Acme',
  nonWorkingWeekdays: [],
  publicHolidays: [
    { id: 'ph-1', date: '2026-07-14', label: 'Bastille Day' },
  ],
};

function useCaseFor(
  session: InMemorySessionGateway,
): AddCompanyPublicHolidayFromSessionUseCase {
  const http = new InMemoryHttpClient();
  http.reply('post', 'companies/c1/calendar/public-holidays', {
    status: 200,
    data: retained,
  });
  return new AddCompanyPublicHolidayFromSessionUseCase(
    session,
    new ApiCompanyPublicHolidaysGateway(http),
  );
}

describe('AddCompanyPublicHolidayFromSessionUseCase', () => {
  it('retains the public holiday on the company of the signed-in actor', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway('token', actor));

    await expect(
      useCase.execute({ date: '2026-07-14', label: 'Bastille Day' }),
    ).resolves.toEqual(retained);
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
