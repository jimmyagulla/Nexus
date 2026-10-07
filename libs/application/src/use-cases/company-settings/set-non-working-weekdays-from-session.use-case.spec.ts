import {
  InMemoryCompanySettingsGateway,
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

function snapshots(): Map<string, CompanySettingsSnapshot> {
  return new Map([
    [
      'c1',
      {
        id: 'c1',
        name: 'Acme',
        nonWorkingWeekdays: [DayOfWeek.SATURDAY, DayOfWeek.SUNDAY],
        publicHolidays: [],
      },
    ],
  ]);
}

describe('SetNonWorkingWeekdaysFromSessionUseCase', () => {
  it('stores the weekdays on the company of the signed-in actor', async () => {
    const companySettings = new InMemoryCompanySettingsGateway(
      'token',
      snapshots(),
    );
    const useCase = new SetNonWorkingWeekdaysFromSessionUseCase(
      new InMemorySessionGateway('token', actor),
      companySettings,
    );

    const settings = await useCase.execute([DayOfWeek.SUNDAY]);

    expect(settings.nonWorkingWeekdays).toEqual([DayOfWeek.SUNDAY]);
    expect(companySettings.snapshotOf('c1').nonWorkingWeekdays).toEqual([
      DayOfWeek.SUNDAY,
    ]);
  });

  it('refuses when the session carries no company', async () => {
    const companySettings = new InMemoryCompanySettingsGateway(
      'token',
      snapshots(),
    );
    const useCase = new SetNonWorkingWeekdaysFromSessionUseCase(
      new InMemorySessionGateway('token', { ...actor, companyId: null }),
      companySettings,
    );

    await expect(useCase.execute([DayOfWeek.SUNDAY])).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
    expect(companySettings.snapshotOf('c1').nonWorkingWeekdays).toEqual([
      DayOfWeek.SATURDAY,
      DayOfWeek.SUNDAY,
    ]);
  });

  it('refuses when the session carries no token', async () => {
    const companySettings = new InMemoryCompanySettingsGateway(
      'token',
      snapshots(),
    );
    const useCase = new SetNonWorkingWeekdaysFromSessionUseCase(
      new InMemorySessionGateway(null, actor),
      companySettings,
    );

    await expect(useCase.execute([DayOfWeek.SUNDAY])).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
    expect(companySettings.snapshotOf('c1').nonWorkingWeekdays).toEqual([
      DayOfWeek.SATURDAY,
      DayOfWeek.SUNDAY,
    ]);
  });
});