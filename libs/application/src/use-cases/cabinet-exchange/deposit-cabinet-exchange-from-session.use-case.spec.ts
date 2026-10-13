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
import { DepositCabinetExchangeFromSessionUseCase } from './deposit-cabinet-exchange-from-session.use-case';

const actor: ActorContext = {
  userId: 'cab-1',
  companyId: 'c1',
  role: UserRole.ACCOUNTANT,
};

const deposited: CabinetExchangeSnapshot = {
  id: 'ex-9',
  direction: ExchangeDirection.CABINET_TO_COMPANY,
  status: ExchangeStatus.RECEIVED,
  category: 'Bilan',
  document: { fileName: 'bilan.pdf', mimeType: 'application/pdf', size: 2 },
  senderId: 'cab-1',
  date: '2026-10-08T10:00:00.000Z',
  consultedAt: null,
};

const input = {
  category: 'Bilan',
  file: {
    fileName: 'bilan.pdf',
    mimeType: 'application/pdf',
    content: new Uint8Array([72, 105]),
  },
};

function useCaseFor(
  session: InMemorySessionGateway,
): DepositCabinetExchangeFromSessionUseCase {
  const http = new InMemoryHttpClient();
  http.reply('post', 'companies/c1/cabinet-exchanges/deposit', {
    status: 201,
    data: deposited,
  });
  return new DepositCabinetExchangeFromSessionUseCase(
    session,
    new ApiCabinetExchangeGateway(http),
  );
}

describe('DepositCabinetExchangeFromSessionUseCase', () => {
  it('deposits the document on the company of the signed-in cabinet', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway('token', actor));

    await expect(useCase.execute(input)).resolves.toEqual(deposited);
  });

  it('refuses when the session carries no company', async () => {
    const useCase = useCaseFor(
      new InMemorySessionGateway('token', { ...actor, companyId: null }),
    );

    await expect(useCase.execute(input)).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });

  it('refuses when the session carries no token', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway(null, actor));

    await expect(useCase.execute(input)).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });
});
