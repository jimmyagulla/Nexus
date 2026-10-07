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
import { RemoveCompanyPublicHolidayFromSessionUseCase } from './remove-company-public-holiday-from-session.use-case';

const actor: ActorContext = {
  userId: 'user-1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

const cleared: CompanySettingsSnapshot = {
  id: 'c1',
  name: 'Acme',
  nonWorkingWeekdays: [],
  publicHolidays: [],
};

function gatewayOver(http: InMemoryHttpClient): ApiCompanyPublicHolidaysGateway {
  return new ApiCompanyPublicHolidaysGateway(http);
}

describe('RemoveCompanyPublicHolidayFromSessionUseCase', () => {
  it('drops the public holiday from the company of the signed-in actor', async () => {
    const http = new InMemoryHttpClient();
    http.reply('delete', 'companies/c1/calendar/public-holidays/ph-1', {
      status: 200,
      data: cleared,
    });
    const useCase = new RemoveCompanyPublicHolidayFromSessionUseCase(
      new InMemorySessionGateway('token', actor),
      gatewayOver(http),
    );

    await expect(useCase.execute('ph-1')).resolves.toEqual(cleared);
  });

  it('refuses when the session carries no company', async () => {
    const useCase = new RemoveCompanyPublicHolidayFromSessionUseCase(
      new InMemorySessionGateway('token', { ...actor, companyId: null }),
      gatewayOver(new InMemoryHttpClient()),
    );

    await expect(useCase.execute('ph-1')).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses when the session carries no token', async () => {
    const useCase = new RemoveCompanyPublicHolidayFromSessionUseCase(
      new InMemorySessionGateway(null, actor),
      gatewayOver(new InMemoryHttpClient()),
    );

    await expect(useCase.execute('ph-1')).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('surfaces the gateway refusal when the holiday cannot be removed', async () => {
    const http = new InMemoryHttpClient();
    http.reject(
      'delete',
      'companies/c1/calendar/public-holidays/ph-missing',
      new Error(ErrorCode.ACCESS_DENIED),
    );
    const useCase = new RemoveCompanyPublicHolidayFromSessionUseCase(
      new InMemorySessionGateway('token', actor),
      gatewayOver(http),
    );

    await expect(useCase.execute('ph-missing')).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });
});
