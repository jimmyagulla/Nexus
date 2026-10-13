import {
  ApiCabinetExchangeGateway,
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  CabinetExchangeSnapshot,
  ErrorCode,
  ExchangeDirection,
  ExchangeStatus,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { ListCabinetExchangesFromSessionUseCase } from './list-cabinet-exchanges-from-session.use-case';

const actor: ActorContext = {
  userId: 'user-1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

const listed: CabinetExchangeSnapshot = {
  id: 'ex-1',
  direction: ExchangeDirection.COMPANY_TO_CABINET,
  status: ExchangeStatus.DRAFT,
  category: null,
  document: null,
  senderId: 'user-1',
  date: '2026-10-06T09:00:00.000Z',
};

function useCaseFor(
  session: InMemorySessionGateway,
): ListCabinetExchangesFromSessionUseCase {
  const http = new InMemoryHttpClient();
  http.reply('get', 'companies/c1/cabinet-exchanges', {
    status: 200,
    data: [listed],
  });
  return new ListCabinetExchangesFromSessionUseCase(
    session,
    new ApiCabinetExchangeGateway(http),
  );
}

describe('ListCabinetExchangesFromSessionUseCase', () => {
  it('lists the exchanges of the signed-in actor company', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway('token', actor));

    await expect(useCase.execute()).resolves.toEqual([listed]);
  });

  it('refuses when the session carries no company', async () => {
    const useCase = useCaseFor(
      new InMemorySessionGateway('token', { ...actor, companyId: null }),
    );

    await expect(useCase.execute()).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses when the session carries no token', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway(null, actor));

    await expect(useCase.execute()).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
