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
import { TransmitCabinetExchangesFromSessionUseCase } from './transmit-cabinet-exchanges-from-session.use-case';

const actor: ActorContext = {
  userId: 'user-1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

const received: CabinetExchangeSnapshot = {
  id: 'ex-1',
  direction: ExchangeDirection.COMPANY_TO_CABINET,
  status: ExchangeStatus.RECEIVED,
  category: 'Facture',
  document: { fileName: 'a.pdf', mimeType: 'application/pdf', size: 1 },
  senderId: 'user-1',
  date: '2026-10-06T10:00:00.000Z',
};

function useCaseFor(
  session: InMemorySessionGateway,
): TransmitCabinetExchangesFromSessionUseCase {
  const http = new InMemoryHttpClient();
  http.reply('post', 'companies/c1/cabinet-exchanges/transmission', {
    status: 200,
    data: [received],
  });
  return new TransmitCabinetExchangesFromSessionUseCase(
    session,
    new ApiCabinetExchangeGateway(http),
  );
}

describe('TransmitCabinetExchangesFromSessionUseCase', () => {
  it('transmits the exchanges of the signed-in actor company', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway('token', actor));

    await expect(useCase.execute(['ex-1'])).resolves.toEqual([received]);
  });

  it('refuses when the session carries no company', async () => {
    const useCase = useCaseFor(
      new InMemorySessionGateway('token', { ...actor, companyId: null }),
    );

    await expect(useCase.execute(['ex-1'])).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });

  it('refuses when the session carries no token', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway(null, actor));

    await expect(useCase.execute(['ex-1'])).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });
});
