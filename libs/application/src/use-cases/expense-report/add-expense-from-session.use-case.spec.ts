import {
  ApiExpenseReportGateway,
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  ErrorCode,
  ExpenseDetailsInput,
  ExpenseReportSnapshot,
  ExpenseReportStatus,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { AddExpenseFromSessionUseCase } from './add-expense-from-session.use-case';

const actor: ActorContext = {
  userId: 'e1',
  companyId: 'c1',
  role: UserRole.EMPLOYEE,
};

const expense: ExpenseDetailsInput = {
  date: '2026-10-05',
  categoryId: 'restaurant',
  amount: 45,
  vat: null,
  paymentMethod: 'Carte',
  description: 'Déjeuner',
  assignment: 'Client Dupont',
};

const updated: ExpenseReportSnapshot = {
  id: 'r1',
  companyId: 'c1',
  employeeId: 'e1',
  label: 'Déplacement Lyon',
  status: ExpenseReportStatus.DRAFT,
  expenses: [{ id: 'x1', ...expense }],
};

function useCaseFor(session: InMemorySessionGateway) {
  const http = new InMemoryHttpClient();
  http.reply('post', 'companies/c1/expense-reports/r1/expenses', {
    status: 201,
    data: updated,
  });
  return {
    http,
    useCase: new AddExpenseFromSessionUseCase(
      session,
      new ApiExpenseReportGateway(http),
    ),
  };
}

describe('AddExpenseFromSessionUseCase', () => {
  it('adds the expense to the report of the signed-in actor', async () => {
    const { useCase, http } = useCaseFor(
      new InMemorySessionGateway('token', actor),
    );

    await expect(
      useCase.execute({ reportId: 'r1', expense }),
    ).resolves.toEqual(updated);
    expect(http.calls[0]?.data).toEqual(expense);
  });

  it('refuses when the session carries no company', async () => {
    const { useCase } = useCaseFor(
      new InMemorySessionGateway('token', { ...actor, companyId: null }),
    );

    await expect(useCase.execute({ reportId: 'r1', expense })).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });

  it('refuses when the session carries no token', async () => {
    const { useCase } = useCaseFor(new InMemorySessionGateway(null, actor));

    await expect(useCase.execute({ reportId: 'r1', expense })).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });
});
