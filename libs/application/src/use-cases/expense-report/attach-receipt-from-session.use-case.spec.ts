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
  ReceiptDetailsInput,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { AttachReceiptFromSessionUseCase } from './attach-receipt-from-session.use-case';

const actor: ActorContext = {
  userId: 'e1',
  companyId: 'c1',
  role: UserRole.EMPLOYEE,
};

const receipt: ReceiptDetailsInput = {
  fileName: 'ticket.pdf',
  mimeType: 'application/pdf',
  content: new Uint8Array([72, 101, 108, 108, 111]),
  expenseId: null,
};

const updated: ExpenseReportSnapshot = {
  id: 'r1',
  companyId: 'c1',
  employeeId: 'e1',
  label: 'Déplacement Lyon',
  status: ExpenseReportStatus.DRAFT,
  total: 0,
  receipts: [],
  reimbursedAmount: null,
  expenses: [],
};

function useCaseFor(session: InMemorySessionGateway) {
  const http = new InMemoryHttpClient();
  http.reply('post', 'companies/c1/expense-reports/r1/receipts', {
    status: 201,
    data: updated,
  });
  return {
    http,
    useCase: new AttachReceiptFromSessionUseCase(
      session,
      new ApiExpenseReportGateway(http),
    ),
  };
}

describe('AttachReceiptFromSessionUseCase', () => {
  it('sends the receipt on the company of the signed-in actor', async () => {
    const { useCase, http } = useCaseFor(
      new InMemorySessionGateway('token', actor),
    );

    await expect(
      useCase.execute({ reportId: 'r1', receipt }),
    ).resolves.toEqual(updated);
    expect(http.calls[0]?.data).toMatchObject({
      fileName: 'ticket.pdf',
      contentBase64: 'SGVsbG8=',
    });
  });

  it('refuses when the session carries no company', async () => {
    const { useCase } = useCaseFor(
      new InMemorySessionGateway('token', { ...actor, companyId: null }),
    );

    await expect(useCase.execute({ reportId: 'r1', receipt })).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });

  it('refuses when the session carries no token', async () => {
    const { useCase } = useCaseFor(new InMemorySessionGateway(null, actor));

    await expect(useCase.execute({ reportId: 'r1', receipt })).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });
});
