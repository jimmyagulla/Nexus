import {
  ApiExpenseReportGateway,
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  ErrorCode,
  ExpenseReportSnapshot,
  ExpenseReportStatus,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { CreateExpenseReportFromSessionUseCase } from './create-expense-report-from-session.use-case';

const actor: ActorContext = {
  userId: 'e1',
  companyId: 'c1',
  role: UserRole.EMPLOYEE,
};

const created: ExpenseReportSnapshot = {
  id: 'r1',
  companyId: 'c1',
  employeeId: 'e1',
  label: 'Déplacement Lyon',
  status: ExpenseReportStatus.DRAFT,
  total: 0,
  receipts: [],
  expenses: [],
};

function useCaseFor(session: InMemorySessionGateway) {
  const http = new InMemoryHttpClient();
  http.reply('post', 'companies/c1/expense-reports', {
    status: 201,
    data: created,
  });
  return {
    http,
    useCase: new CreateExpenseReportFromSessionUseCase(
      session,
      new ApiExpenseReportGateway(http),
    ),
  };
}

describe('CreateExpenseReportFromSessionUseCase', () => {
  it('opens the report on the company of the signed-in actor', async () => {
    const { useCase, http } = useCaseFor(
      new InMemorySessionGateway('token', actor),
    );

    await expect(useCase.execute('Déplacement Lyon')).resolves.toEqual(created);
    expect(http.calls[0]?.data).toEqual({ label: 'Déplacement Lyon' });
  });

  it('refuses when the session carries no company', async () => {
    const { useCase } = useCaseFor(
      new InMemorySessionGateway('token', { ...actor, companyId: null }),
    );

    await expect(useCase.execute('Lyon')).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });

  it('refuses when the session carries no token', async () => {
    const { useCase } = useCaseFor(new InMemorySessionGateway(null, actor));

    await expect(useCase.execute('Lyon')).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });
});
