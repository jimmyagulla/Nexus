import { describe, expect, it } from 'vitest';
import {
  FixedClock,
  InMemoryExpenseReportGateway,
  InMemorySessionGateway,
  RandomUuidGenerator,
} from '@hexagonal-monorepo-template/adapters';
import {
  ListExpenseReportsFromSessionUseCase,
  ReviseExpenseReportFromSessionUseCase,
  SubmitExpenseReportFromSessionUseCase,
  ViewExpenseReportProofFromSessionUseCase,
} from '@hexagonal-monorepo-template/application';
import { UserRole } from '@hexagonal-monorepo-template/domain';
import { i18n } from '../../infrastructure/ui/i18n/i18n';
import {
  EVERY_EXPENSE_REPORT,
  ExpenseReportForm,
  ExpenseReportsController,
} from './expense-reports.controller';

const png = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);

function setUp(): ExpenseReportsController {
  const sessions = new InMemorySessionGateway('u1', { userId: 'u1', companyId: 'c1', role: UserRole.EMPLOYEE });
  const reports = new InMemoryExpenseReportGateway(new RandomUuidGenerator(), new FixedClock(new Date('2026-10-19T10:00:00Z')));
  return new ExpenseReportsController(
    new ListExpenseReportsFromSessionUseCase(sessions, reports),
    new SubmitExpenseReportFromSessionUseCase(sessions, reports),
    new ReviseExpenseReportFromSessionUseCase(sessions, reports),
    new ViewExpenseReportProofFromSessionUseCase(sessions, reports),
    { categories: i18n.messages.expenseReports.categories },
  );
}

const form: ExpenseReportForm = {
  date: '2026-09-12', category: 'MEAL', paymentMethod: 'COMPANY_CARD', amount: '45,00', vatRate: '10',
  description: 'Déjeuner client Valette', project: 'Client Valette', proof: null, keepProof: false,
};

describe('ExpenseReportsController', () => {
  it('asks for the default ordering while no column is sorted', () => {
    expect(setUp().criteriaFor(EVERY_EXPENSE_REPORT)).toMatchObject({ sort: 'DATE', direction: 'DESC', searchCategories: [] });
  });

  it('resolves the categories whose label matches the search, whatever the accents', () => {
    expect(setUp().criteriaFor({ ...EVERY_EXPENSE_REPORT, search: 'deplacement' }).searchCategories).toEqual(['TRAVEL']);
  });

  it('normalizes the amount bounds and drops what is not an amount nor a day', () => {
    expect(setUp().criteriaFor({
      ...EVERY_EXPENSE_REPORT, minAmount: '12,5', maxAmount: 'beaucoup', from: '2026-02-30', to: '2026-09-30',
    })).toMatchObject({ minAmount: '12.50', maxAmount: null, from: null, to: '2026-09-30' });
  });

  it('sends the form as typed, with the rate as a number and the receipt read', async () => {
    const controller = setUp();
    const proof = new File([png], 'ticket.png', { type: 'image/png' });

    const submitted = await controller.submitExpenseReport({ ...form, proof });

    expect(submitted).toMatchObject({ amount: '45.00', vatRate: 10, vatAmount: '4.09', proof: { fileName: 'ticket.png' } });
  });

  it('treats any other VAT choice as no VAT', async () => {
    await expect(setUp().submitExpenseReport({ ...form, vatRate: 'none' })).resolves.toMatchObject({ vatRate: null, vatAmount: null });
  });

  it('revises a report, keeping its receipt', async () => {
    const controller = setUp();
    const submitted = await controller.submitExpenseReport({ ...form, proof: new File([png], 'ticket.png') });

    const revised = await controller.reviseExpenseReport(submitted.id, { ...form, amount: '50', keepProof: true });

    expect([revised.amount, revised.proof?.fileName]).toEqual(['50.00', 'ticket.png']);
  });
});
