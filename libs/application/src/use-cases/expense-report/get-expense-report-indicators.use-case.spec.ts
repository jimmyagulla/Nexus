import { InMemoryExpenseReportRepository } from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  ErrorCode,
  ExpenseDetails,
  ExpenseReportLabel,
  ReceiptDetails,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { GetExpenseReportIndicatorsUseCase } from './get-expense-report-indicators.use-case';

const employer: ActorContext = {
  userId: 'u1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

const employee: ActorContext = {
  userId: 'e1',
  companyId: 'c1',
  role: UserRole.EMPLOYEE,
};

async function seeded() {
  const reports = new InMemoryExpenseReportRepository();
  const make = async (
    companyId: string,
    employeeId: string,
    amount: number,
    steps: 'draft' | 'submitted' | 'reviewed' | 'validated' | 'reimbursed',
  ) => {
    const created = await reports.insert(
      companyId,
      employeeId,
      ExpenseReportLabel.parse('Note'),
    );
    await reports.insertExpense(
      created.id,
      ExpenseDetails.parse({
        date: '2026-10-05',
        categoryId: 'train',
        amount,
        vat: null,
        paymentMethod: 'Carte',
        description: 'Billet',
        assignment: 'Projet X',
      }),
    );
    await reports.insertReceipt(
      created.id,
      ReceiptDetails.parse({
        fileName: 'ticket.pdf',
        mimeType: 'application/pdf',
        content: new Uint8Array([1]),
        expenseId: null,
      }),
    );
    const stored = await reports.findById(companyId, created.id);
    if (stored === null) {
      throw new Error('unreachable');
    }
    if (steps === 'draft') {
      return;
    }
    const submitted = stored.submit();
    const reviewed = submitted.startReview();
    const validated = reviewed.validate();
    const final = {
      submitted,
      reviewed,
      validated,
      reimbursed: validated.reimburse(),
    }[steps];
    await reports.save(final);
  };
  await make('c1', 'e1', 10, 'submitted');
  await make('c1', 'e1', 20, 'validated');
  await make('c1', 'e1', 40, 'reimbursed');
  await make('c1', 'e1', 80, 'draft');
  await make('c1', 'e2', 160, 'reviewed');
  await make('c2', 'e1', 320, 'submitted');
  return new GetExpenseReportIndicatorsUseCase(reports);
}

describe('GetExpenseReportIndicatorsUseCase', () => {
  it('counts for the employer the reports of the company to process', async () => {
    const useCase = await seeded();

    await expect(
      useCase.execute({ actor: employer, companyId: 'c1' }),
    ).resolves.toEqual({
      'notes.a-traiter': 2,
      'notes.montant-attente': 170,
    });
  });

  it('counts for the employee only her own reports in progress', async () => {
    const useCase = await seeded();

    await expect(
      useCase.execute({ actor: employee, companyId: 'c1' }),
    ).resolves.toEqual({
      'notes.en-cours': 2,
      'notes.montant-en-cours': 30,
    });
  });

  it('refuses another company', async () => {
    const useCase = await seeded();

    await expect(
      useCase.execute({ actor: employer, companyId: 'c2' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses the accounting firm', async () => {
    const useCase = await seeded();

    await expect(
      useCase.execute({
        actor: { ...employer, role: UserRole.ACCOUNTANT },
        companyId: 'c1',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
