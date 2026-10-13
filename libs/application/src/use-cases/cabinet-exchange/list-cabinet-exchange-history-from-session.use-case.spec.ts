import {
  ApiCabinetExchangeGateway,
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  ErrorCode,
  ExchangeDirection,
  ExchangeEventKind,
  ExchangeHistoryEntry,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { ListCabinetExchangeHistoryFromSessionUseCase } from './list-cabinet-exchange-history-from-session.use-case';

const actor: ActorContext = {
  userId: 'cab-1',
  companyId: 'c1',
  role: UserRole.ACCOUNTANT,
};

const entry: ExchangeHistoryEntry = {
  exchangeId: 'ex-1',
  kind: ExchangeEventKind.TRANSMITTED,
  actorRole: UserRole.EMPLOYER,
  occurredAt: '2026-10-06T10:00:00.000Z',
  documentCount: 1,
  direction: ExchangeDirection.COMPANY_TO_CABINET,
  fileName: 'a.pdf',
};

function useCaseFor(
  session: InMemorySessionGateway,
): ListCabinetExchangeHistoryFromSessionUseCase {
  const http = new InMemoryHttpClient();
  http.reply('get', 'companies/c1/cabinet-exchanges/history', {
    status: 200,
    data: [entry],
  });
  http.reply('get', 'companies/c1/cabinet-exchanges/ex-1/history', {
    status: 200,
    data: [entry],
  });
  return new ListCabinetExchangeHistoryFromSessionUseCase(
    session,
    new ApiCabinetExchangeGateway(http),
  );
}

describe('ListCabinetExchangeHistoryFromSessionUseCase', () => {
  it('reads the history of the company of the signed-in actor', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway('token', actor));

    await expect(useCase.execute()).resolves.toEqual([entry]);
  });

  it('reads the history of one exchange', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway('token', actor));

    await expect(useCase.execute('ex-1')).resolves.toEqual([entry]);
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
