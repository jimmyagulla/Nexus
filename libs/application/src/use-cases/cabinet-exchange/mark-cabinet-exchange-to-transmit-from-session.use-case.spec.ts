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
import { MarkCabinetExchangeToTransmitFromSessionUseCase } from './mark-cabinet-exchange-to-transmit-from-session.use-case';

const actor: ActorContext = {
  userId: 'user-1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

const marked: CabinetExchangeSnapshot = {
  id: 'ex-1',
  direction: ExchangeDirection.COMPANY_TO_CABINET,
  status: ExchangeStatus.TO_TRANSMIT,
  category: 'Facture',
  document: { fileName: 'a.pdf', mimeType: 'application/pdf', size: 1 },
  senderId: 'user-1',
  date: '2026-10-06T09:00:00.000Z',
  consultedAt: null,
};

function useCaseFor(
  session: InMemorySessionGateway,
): MarkCabinetExchangeToTransmitFromSessionUseCase {
  const http = new InMemoryHttpClient();
  http.reply('post', 'companies/c1/cabinet-exchanges/ex-1/to-transmit', {
    status: 200,
    data: marked,
  });
  return new MarkCabinetExchangeToTransmitFromSessionUseCase(
    session,
    new ApiCabinetExchangeGateway(http),
  );
}

describe('MarkCabinetExchangeToTransmitFromSessionUseCase', () => {
  it('marks the exchange of the signed-in actor company', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway('token', actor));

    await expect(useCase.execute({ exchangeId: 'ex-1' })).resolves.toEqual(
      marked,
    );
  });

  it('refuses when the session carries no company', async () => {
    const useCase = useCaseFor(
      new InMemorySessionGateway('token', { ...actor, companyId: null }),
    );

    await expect(useCase.execute({ exchangeId: 'ex-1' })).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });

  it('refuses when the session carries no token', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway(null, actor));

    await expect(useCase.execute({ exchangeId: 'ex-1' })).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });
});
