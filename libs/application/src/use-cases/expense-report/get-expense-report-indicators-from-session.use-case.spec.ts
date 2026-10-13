import {
  ApiExpenseReportGateway,
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { GetExpenseReportIndicatorsFromSessionUseCase } from './get-expense-report-indicators-from-session.use-case';

const actor: ActorContext = {
  userId: 'u1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

const indicators = { 'notes.a-traiter': 2, 'notes.montant-attente': 170 };

function useCaseFor(session: InMemorySessionGateway) {
  const http = new InMemoryHttpClient();
  http.reply('get', 'companies/c1/expense-report-indicators', {
    status: 200,
    data: indicators,
  });
  return new GetExpenseReportIndicatorsFromSessionUseCase(
    session,
    new ApiExpenseReportGateway(http),
  );
}

describe('GetExpenseReportIndicatorsFromSessionUseCase', () => {
  it('reads the indicators of the company of the signed-in actor', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway('token', actor));

    await expect(useCase.execute()).resolves.toEqual(indicators);
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
