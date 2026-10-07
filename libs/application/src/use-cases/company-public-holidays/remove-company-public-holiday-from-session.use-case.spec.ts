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
import { RemoveCompanyPublicHolidayFromSessionUseCase } from './remove-company-public-holiday-from-session.use-case';

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
        nonWorkingWeekdays: [],
        publicHolidays: [
          { id: 'ph-1', date: '2026-07-14', label: 'Bastille Day' },
        ],
      },
    ],
  ]);
}

describe('RemoveCompanyPublicHolidayFromSessionUseCase', () => {
  it('drops the public holiday from the company of the signed-in actor', async () => {
    const publicHolidays = new InMemoryCompanyPublicHolidaysGateway(
      'token',
      snapshots(),
    );
    const useCase = new RemoveCompanyPublicHolidayFromSessionUseCase(
      new InMemorySessionGateway('token', actor),
      publicHolidays,
    );

    const settings = await useCase.execute('ph-1');

    expect(settings.publicHolidays).toEqual([]);
    expect(publicHolidays.snapshotOf('c1').publicHolidays).toEqual([]);
  });

  it('refuses when the session carries no company', async () => {
    const publicHolidays = new InMemoryCompanyPublicHolidaysGateway(
      'token',
      snapshots(),
    );
    const useCase = new RemoveCompanyPublicHolidayFromSessionUseCase(
      new InMemorySessionGateway('token', { ...actor, companyId: null }),
      publicHolidays,
    );

    await expect(useCase.execute('ph-1')).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
    expect(publicHolidays.snapshotOf('c1').publicHolidays).toHaveLength(1);
  });

  it('refuses when the session carries no token', async () => {
    const publicHolidays = new InMemoryCompanyPublicHolidaysGateway(
      'token',
      snapshots(),
    );
    const useCase = new RemoveCompanyPublicHolidayFromSessionUseCase(
      new InMemorySessionGateway(null, actor),
      publicHolidays,
    );

    await expect(useCase.execute('ph-1')).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
    expect(publicHolidays.snapshotOf('c1').publicHolidays).toHaveLength(1);
  });

  it('refuses a public holiday the company never retained', async () => {
    const publicHolidays = new InMemoryCompanyPublicHolidaysGateway(
      'token',
      snapshots(),
    );
    const useCase = new RemoveCompanyPublicHolidayFromSessionUseCase(
      new InMemorySessionGateway('token', actor),
      publicHolidays,
    );

    await expect(useCase.execute('ph-missing')).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
    expect(publicHolidays.snapshotOf('c1').publicHolidays).toHaveLength(1);
  });
});