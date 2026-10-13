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
import { RemoveExpenseFromSessionUseCase } from './remove-expense-from-session.use-case';

const actor: ActorContext = {
  userId: 'e1',
  companyId: 'c1',
  role: UserRole.EMPLOYEE,
};

const updated: ExpenseReportSnapshot = {
  id: 'r1',
  companyId: 'c1',
  employeeId: 'e1',
  label: 'Déplacement Lyon',
  status: ExpenseReportStatus.DRAFT,
  total: 57,
  expenses: [],
};

function useCaseFor(session: InMemorySessionGateway) {
  const http = new InMemoryHttpClient();
  http.reply('delete', 'companies/c1/expense-reports/r1/expenses/x3', {
    status: 200,
    data: updated,
  });
  return new RemoveExpenseFromSessionUseCase(
    session,
    new ApiExpenseReportGateway(http),
  );
}

describe('RemoveExpenseFromSessionUseCase', () => {
  it('removes the expense on the company of the signed-in actor', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway('token', actor));

    await expect(
      useCase.execute({ reportId: 'r1', expenseId: 'x3' }),
    ).resolves.toEqual(updated);
  });

  it('refuses when the session carries no company', async () => {
    const useCase = useCaseFor(
      new InMemorySessionGateway('token', { ...actor, companyId: null }),
    );

    await expect(
      useCase.execute({ reportId: 'r1', expenseId: 'x3' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses when the session carries no token', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway(null, actor));

    await expect(
      useCase.execute({ reportId: 'r1', expenseId: 'x3' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
