import {
  ApiCompanySettingsGateway,
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  CompanySettingsSnapshot,
  DayOfWeek,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { SetNonWorkingWeekdaysFromSessionUseCase } from './set-non-working-weekdays-from-session.use-case';

const actor: ActorContext = {
  userId: 'user-1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

const updated: CompanySettingsSnapshot = {
  id: 'c1',
  name: 'Acme',
  nonWorkingWeekdays: [DayOfWeek.SUNDAY],
  publicHolidays: [],
};

function useCaseFor(
  session: InMemorySessionGateway,
): SetNonWorkingWeekdaysFromSessionUseCase {
  const http = new InMemoryHttpClient();
  http.reply('put', 'companies/c1/calendar/non-working-weekdays', {
    status: 200,
    data: updated,
  });
  return new SetNonWorkingWeekdaysFromSessionUseCase(
    session,
    new ApiCompanySettingsGateway(http),
  );
}

describe('SetNonWorkingWeekdaysFromSessionUseCase', () => {
  it('stores the weekdays on the company of the signed-in actor', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway('token', actor));

    await expect(useCase.execute([DayOfWeek.SUNDAY])).resolves.toEqual(updated);
  });

  it('refuses when the session carries no company', async () => {
    const useCase = useCaseFor(
      new InMemorySessionGateway('token', { ...actor, companyId: null }),
    );

    await expect(useCase.execute([DayOfWeek.SUNDAY])).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });

  it('refuses when the session carries no token', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway(null, actor));

    await expect(useCase.execute([DayOfWeek.SUNDAY])).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });
});
