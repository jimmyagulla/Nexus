import {
  FixedClock,
  InMemoryExpenseReportGateway,
  InMemorySessionGateway,
  RandomUuidGenerator,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  ErrorCode,
  ExpenseReportListCriteria,
  ExpenseReportRequest,
  ExpenseReportSort,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { ListExpenseReportsFromSessionUseCase } from './list-expense-reports-from-session.use-case';
import { ReviseExpenseReportFromSessionUseCase } from './revise-expense-report-from-session.use-case';
import { SubmitExpenseReportFromSessionUseCase } from './submit-expense-report-from-session.use-case';
import { ViewExpenseReportProofFromSessionUseCase } from './view-expense-report-proof-from-session.use-case';

const actor: ActorContext = { userId: 'u1', companyId: 'c1', role: UserRole.EMPLOYEE };
const png = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);
const details: ExpenseReportRequest = {
  date: '2026-09-12', category: 'PARKING', paymentMethod: 'PERSONAL_CARD', amount: '12',
  vatRate: 20, description: 'Parking Polygone', project: null,
};
const everything: ExpenseReportListCriteria = {
  search: '', searchCategories: [], categories: [], statuses: [], projects: [], proofs: [],
  from: null, to: null, minAmount: null, maxAmount: null, sort: ExpenseReportSort.DATE, direction: 'DESC',
};

function setUp(sessionActor: ActorContext = actor) {
  const sessions = new InMemorySessionGateway('u1', sessionActor);
  const reports = new InMemoryExpenseReportGateway(new RandomUuidGenerator(), new FixedClock(new Date('2026-10-19T10:00:00Z')));
  return {
    list: new ListExpenseReportsFromSessionUseCase(sessions, reports),
    submit: new SubmitExpenseReportFromSessionUseCase(sessions, reports),
    revise: new ReviseExpenseReportFromSessionUseCase(sessions, reports),
    view: new ViewExpenseReportProofFromSessionUseCase(sessions, reports),
  };
}

describe('expense reports from the session', () => {
  it('submits, revises, lists and opens the reports of the session', async () => {
    const { list, submit, revise, view } = setUp();

    const submitted = await submit.execute({ details, proof: { fileName: 'ticket.png', content: png } });
    await revise.execute({ expenseReportId: submitted.id, revision: { details: { ...details, amount: '14' }, proof: null, keepProof: true } });

    await expect(list.execute(everything)).resolves.toMatchObject({ total: 1, items: [{ amount: '14.00', vatAmount: '2.33' }] });
    await expect(view.execute(submitted.id)).resolves.toMatchObject({ fileName: 'ticket.png' });
  });

  it('refuses a report the rules of the API would refuse, before it travels', async () => {
    const { submit } = setUp();

    await expect(submit.execute({ details: { ...details, amount: '-3' }, proof: null })).rejects.toThrow(ErrorCode.INVALID_INFORMATION);
  });

  it('refuses when the session carries no company', async () => {
    const { list } = setUp({ ...actor, companyId: null });

    await expect(list.execute(everything)).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
