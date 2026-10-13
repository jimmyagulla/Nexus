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
import { CreateCabinetExchangeDraftFromSessionUseCase } from './create-cabinet-exchange-draft-from-session.use-case';

const actor: ActorContext = {
  userId: 'user-1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

const created: CabinetExchangeSnapshot = {
  id: 'ex-1',
  direction: ExchangeDirection.COMPANY_TO_CABINET,
  status: ExchangeStatus.DRAFT,
  category: 'Facture',
  document: null,
  senderId: 'user-1',
  date: '2026-10-06T09:00:00.000Z',
  consultedAt: null,
};

function useCaseFor(
  session: InMemorySessionGateway,
): CreateCabinetExchangeDraftFromSessionUseCase {
  const http = new InMemoryHttpClient();
  http.reply('post', 'companies/c1/cabinet-exchanges', {
    status: 201,
    data: created,
  });
  return new CreateCabinetExchangeDraftFromSessionUseCase(
    session,
    new ApiCabinetExchangeGateway(http),
  );
}

describe('CreateCabinetExchangeDraftFromSessionUseCase', () => {
  it('creates the draft on the company of the signed-in actor', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway('token', actor));

    await expect(useCase.execute({ category: 'Facture' })).resolves.toEqual(
      created,
    );
  });

  it('refuses when the session carries no company', async () => {
    const useCase = useCaseFor(
      new InMemorySessionGateway('token', { ...actor, companyId: null }),
    );

    await expect(useCase.execute({})).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses when the session carries no token', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway(null, actor));

    await expect(useCase.execute({})).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
