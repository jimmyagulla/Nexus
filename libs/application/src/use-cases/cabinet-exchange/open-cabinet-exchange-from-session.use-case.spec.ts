import {
  ApiCabinetExchangeGateway,
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { OpenCabinetExchangeFromSessionUseCase } from './open-cabinet-exchange-from-session.use-case';

const actor: ActorContext = {
  userId: 'cab-1',
  companyId: 'c1',
  role: UserRole.ACCOUNTANT,
};

const consulted = {
  id: 'ex-1',
  direction: 'COMPANY_TO_CABINET',
  status: 'CONSULTED',
  category: 'Facture',
  document: null,
  senderId: 'user-1',
  date: '2026-10-06T10:00:00.000Z',
  consultedAt: '2026-10-07T08:00:00.000Z',
} as const;

function useCaseFor(session: InMemorySessionGateway): OpenCabinetExchangeFromSessionUseCase {
  const http = new InMemoryHttpClient();
  http.reply('post', 'companies/c1/cabinet-exchanges/ex-1/consultation', {
    status: 201,
    data: consulted,
  });
  return new OpenCabinetExchangeFromSessionUseCase(session, new ApiCabinetExchangeGateway(http));
}

describe('OpenCabinetExchangeFromSessionUseCase', () => {
  it('opens the exchange on the company of the signed-in actor', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway('token', actor));

    await expect(useCase.execute('ex-1')).resolves.toEqual(consulted);
  });

  it('refuses when the session carries no company', async () => {
    const useCase = useCaseFor(
      new InMemorySessionGateway('token', { ...actor, companyId: null }),
    );

    await expect(useCase.execute('ex-1')).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });

  it('refuses when the session carries no token', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway(null, actor));

    await expect(useCase.execute('ex-1')).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });
});
