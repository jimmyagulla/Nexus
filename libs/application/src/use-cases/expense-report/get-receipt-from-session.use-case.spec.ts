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
import { GetReceiptFromSessionUseCase } from './get-receipt-from-session.use-case';

const actor: ActorContext = {
  userId: 'u1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

function useCaseFor(session: InMemorySessionGateway) {
  const http = new InMemoryHttpClient();
  http.reply('get', 'companies/c1/expense-reports/r1/receipts/f1', {
    status: 200,
    data: {
      id: 'f1',
      fileName: 'ticket.pdf',
      mimeType: 'application/pdf',
      contentBase64: 'SGVsbG8=',
    },
  });
  return new GetReceiptFromSessionUseCase(
    session,
    new ApiExpenseReportGateway(http),
  );
}

describe('GetReceiptFromSessionUseCase', () => {
  it('reads the receipt on the company of the signed-in actor', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway('token', actor));

    await expect(
      useCase.execute({ reportId: 'r1', receiptId: 'f1' }),
    ).resolves.toEqual({
      id: 'f1',
      fileName: 'ticket.pdf',
      mimeType: 'application/pdf',
      content: new Uint8Array([72, 101, 108, 108, 111]),
    });
  });

  it('refuses when the session carries no company', async () => {
    const useCase = useCaseFor(
      new InMemorySessionGateway('token', { ...actor, companyId: null }),
    );

    await expect(
      useCase.execute({ reportId: 'r1', receiptId: 'f1' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses when the session carries no token', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway(null, actor));

    await expect(
      useCase.execute({ reportId: 'r1', receiptId: 'f1' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
