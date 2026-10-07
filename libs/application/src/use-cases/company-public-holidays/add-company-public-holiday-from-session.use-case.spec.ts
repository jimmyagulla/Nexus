import {
  InMemoryCompanyPublicHolidaysGateway,
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

function snapshots(): Map<string, CompanySettingsSnapshot> {
  return new Map([
    [
      'c1',
      { id: 'c1', name: 'Acme', nonWorkingWeekdays: [], publicHolidays: [] },
    ],
  ]);
}

describe('AddCompanyPublicHolidayFromSessionUseCase', () => {
  it('retains the public holiday on the company of the signed-in actor', async () => {
    const publicHolidays = new InMemoryCompanyPublicHolidaysGateway(
      'token',
      snapshots(),
    );
    const useCase = new AddCompanyPublicHolidayFromSessionUseCase(
      new InMemorySessionGateway('token', actor),
      publicHolidays,
    );

    const settings = await useCase.execute({
      date: '2026-07-14',
      label: 'Bastille Day',
    });

    expect(settings.publicHolidays).toEqual([
      {
        id: '2026-07-14-Bastille Day',
        date: '2026-07-14',
        label: 'Bastille Day',
      },
    ]);
    expect(publicHolidays.snapshotOf('c1').publicHolidays).toHaveLength(1);
  });

  it('refuses when the session carries no company', async () => {
    const publicHolidays = new InMemoryCompanyPublicHolidaysGateway(
      'token',
      snapshots(),
    );
    const useCase = new AddCompanyPublicHolidayFromSessionUseCase(
      new InMemorySessionGateway('token', { ...actor, companyId: null }),
      publicHolidays,
    );

    await expect(
      useCase.execute({ date: '2026-07-14', label: 'Bastille Day' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    expect(publicHolidays.snapshotOf('c1').publicHolidays).toEqual([]);
  });

  it('refuses when the session carries no token', async () => {
    const publicHolidays = new InMemoryCompanyPublicHolidaysGateway(
      'token',
      snapshots(),
    );
    const useCase = new AddCompanyPublicHolidayFromSessionUseCase(
      new InMemorySessionGateway(null, actor),
      publicHolidays,
    );

    await expect(
      useCase.execute({ date: '2026-07-14', label: 'Bastille Day' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    expect(publicHolidays.snapshotOf('c1').publicHolidays).toEqual([]);
  });
});