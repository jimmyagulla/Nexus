import {
  FixedClock,
  InMemoryExpenseReportProofStorage,
  InMemoryExpenseReportRepository,
  RandomUuidGenerator,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  ErrorCode,
  ExpenseReportListCriteria,
  ExpenseReportRequest,
  ExpenseReportSort,
  ExpenseReportStatus,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { ChangeExpenseReportStatusUseCase } from './change-expense-report-status.use-case';
import { ListEmployeeExpenseReportsUseCase } from './list-employee-expense-reports.use-case';
import { ListExpenseReportsUseCase } from './list-expense-reports.use-case';
import { ReviseExpenseReportUseCase } from './revise-expense-report.use-case';
import { SubmitExpenseReportUseCase } from './submit-expense-report.use-case';
import { ViewExpenseReportProofUseCase } from './view-expense-report-proof.use-case';

const ids = new RandomUuidGenerator();
const employee: ActorContext = { userId: 'u1', companyId: 'c1', role: UserRole.EMPLOYEE };
const colleague: ActorContext = { userId: 'u2', companyId: 'c1', role: UserRole.EMPLOYEE };
const employer: ActorContext = { userId: 'boss', companyId: 'c1', role: UserRole.EMPLOYER };
const pdf = Uint8Array.from([...'%PDF-1.7\n'].map((c) => c.charCodeAt(0)));
const png = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);

const details: ExpenseReportRequest = {
  date: '2026-09-28',
  category: 'TRAVEL',
  paymentMethod: 'PERSONAL_CARD',
  amount: '68,00',
  vatRate: 10,
  description: 'Montpellier – Lyon',
  project: 'Client Valette',
};

const everything: ExpenseReportListCriteria = {
  search: '', searchCategories: [], categories: [], statuses: [], projects: [], proofs: [],
  from: null, to: null, minAmount: null, maxAmount: null, sort: ExpenseReportSort.DATE, direction: 'DESC',
};

function setUp() {
  const reports = new InMemoryExpenseReportRepository(ids);
  const proofs = new InMemoryExpenseReportProofStorage(ids);
  const submittedAt = new FixedClock(new Date('2026-09-28T18:00:00Z'));
  const processedAt = new FixedClock(new Date('2026-10-08T18:00:00Z'));
  return {
    reports,
    proofs,
    submit: new SubmitExpenseReportUseCase(reports, proofs, submittedAt),
    revise: new ReviseExpenseReportUseCase(reports, proofs),
    view: new ViewExpenseReportProofUseCase(reports, proofs),
    changeStatus: new ChangeExpenseReportStatusUseCase(reports, processedAt),
    list: new ListExpenseReportsUseCase(reports, processedAt),
    listEmployee: new ListEmployeeExpenseReportsUseCase(reports, processedAt),
  };
}

describe('SubmitExpenseReportUseCase', () => {
  it('records a submitted report of the employee, with its receipt in their folder', async () => {
    const { submit, proofs } = setUp();

    const summary = await submit.execute({
      actor: employee,
      submission: { details, proof: { fileName: 'billet.pdf', content: pdf } },
    });

    expect(summary).toMatchObject({
      date: '2026-09-28', amount: '68.00', vatRate: 10, vatAmount: '6.18', status: 'SUBMITTED',
      editable: true, submittedAt: '2026-09-28T18:00:00.000Z', processedAt: null,
      proof: { fileName: 'billet.pdf', format: 'PDF', sizeBytes: pdf.length },
    });
    expect([...proofs.files.keys()].every((key) => key.startsWith('c1/u1/'))).toBe(true);
  });

  it('records a report without a receipt', async () => {
    const { submit } = setUp();

    await expect(submit.execute({ actor: employee, submission: { details, proof: null } })).resolves.toMatchObject({ proof: null });
  });

  it('stores nothing when a field is refused', async () => {
    const { submit, proofs } = setUp();

    await expect(submit.execute({
      actor: employee,
      submission: { details: { ...details, description: '' }, proof: { fileName: 'billet.pdf', content: pdf } },
    })).rejects.toThrow(ErrorCode.REQUIRED_INFORMATION);
    expect(proofs.files.size).toBe(0);
  });

  it('refuses an actor outside any company', async () => {
    const { submit } = setUp();

    await expect(submit.execute({ actor: { ...employee, companyId: null }, submission: { details, proof: null } }))
      .rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});

describe('ReviseExpenseReportUseCase', () => {
  it('replaces the receipt and removes the previous file', async () => {
    const { submit, revise, proofs } = setUp();
    const submitted = await submit.execute({ actor: employee, submission: { details, proof: { fileName: 'billet.pdf', content: pdf } } });

    const revised = await revise.execute({
      actor: employee,
      expenseReportId: submitted.id,
      revision: { details: { ...details, amount: '70' }, proof: { fileName: 'billet.png', content: png }, keepProof: false },
    });

    expect([revised.amount, revised.vatAmount, revised.proof?.fileName, proofs.files.size]).toEqual(['70.00', '6.36', 'billet.png', 1]);
  });

  it('keeps or removes the receipt when no new one comes', async () => {
    const { submit, revise, proofs } = setUp();
    const submitted = await submit.execute({ actor: employee, submission: { details, proof: { fileName: 'billet.pdf', content: pdf } } });

    const kept = await revise.execute({ actor: employee, expenseReportId: submitted.id, revision: { details, proof: null, keepProof: true } });
    const removed = await revise.execute({ actor: employee, expenseReportId: submitted.id, revision: { details, proof: null, keepProof: false } });

    expect([kept.proof?.fileName, removed.proof, proofs.files.size]).toEqual(['billet.pdf', null, 0]);
  });

  it('refuses the report of someone else, and a report already taken up', async () => {
    const { submit, revise, changeStatus, proofs } = setUp();
    const submitted = await submit.execute({ actor: employee, submission: { details, proof: null } });
    const revision = { details, proof: { fileName: 'billet.pdf', content: pdf }, keepProof: false };

    await expect(revise.execute({ actor: colleague, expenseReportId: submitted.id, revision })).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    await changeStatus.execute({ actor: employer, expenseReportId: submitted.id, status: ExpenseReportStatus.IN_PROGRESS });
    await expect(revise.execute({ actor: employee, expenseReportId: submitted.id, revision })).rejects.toThrow(ErrorCode.ALREADY_PROCESSED);
    expect(proofs.files.size).toBe(0);
  });
});

describe('ViewExpenseReportProofUseCase', () => {
  it('opens the receipt for its owner and for an employer of the company', async () => {
    const { submit, view } = setUp();
    const submitted = await submit.execute({ actor: employee, submission: { details, proof: { fileName: 'billet.pdf', content: pdf } } });

    await expect(view.execute({ actor: employee, expenseReportId: submitted.id })).resolves.toMatchObject({
      fileName: 'billet.pdf', contentType: 'application/pdf',
    });
    await expect(view.execute({ actor: employer, expenseReportId: submitted.id })).resolves.toMatchObject({ fileName: 'billet.pdf' });
    await expect(view.execute({ actor: colleague, expenseReportId: submitted.id })).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses a report without a receipt', async () => {
    const { submit, view } = setUp();
    const submitted = await submit.execute({ actor: employee, submission: { details, proof: null } });

    await expect(view.execute({ actor: employee, expenseReportId: submitted.id })).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});

describe('ChangeExpenseReportStatusUseCase', () => {
  it('lets an employer of the company refund a report, dating its processing', async () => {
    const { submit, changeStatus } = setUp();
    const submitted = await submit.execute({ actor: employee, submission: { details, proof: null } });

    await expect(changeStatus.execute({ actor: employer, expenseReportId: submitted.id, status: ExpenseReportStatus.REFUNDED }))
      .resolves.toMatchObject({ status: 'REFUNDED', processedAt: '2026-10-08T18:00:00.000Z', editable: false });
  });

  it('refuses the employee, even on their own report', async () => {
    const { submit, changeStatus } = setUp();
    const submitted = await submit.execute({ actor: employee, submission: { details, proof: null } });

    await expect(changeStatus.execute({ actor: employee, expenseReportId: submitted.id, status: ExpenseReportStatus.REFUNDED }))
      .rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses an employer of another company', async () => {
    const { submit, changeStatus } = setUp();
    const submitted = await submit.execute({ actor: employee, submission: { details, proof: null } });

    await expect(changeStatus.execute({
      actor: { ...employer, companyId: 'c2' }, expenseReportId: submitted.id, status: ExpenseReportStatus.REJECTED,
    })).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});

describe('listing expense reports', () => {
  it('lists the reports of the employee, with their key figures', async () => {
    const { submit, changeStatus, list } = setUp();
    const first = await submit.execute({ actor: employee, submission: { details, proof: null } });
    await submit.execute({ actor: employee, submission: { details: { ...details, amount: '12' }, proof: null } });
    await submit.execute({ actor: colleague, submission: { details, proof: null } });
    await changeStatus.execute({ actor: employer, expenseReportId: first.id, status: ExpenseReportStatus.REFUNDED });

    const result = await list.execute({ actor: employee, criteria: everything });

    expect([result.total, result.stats]).toEqual([2, {
      pending: { count: 1, amount: '12.00' },
      refunded: { year: 2026, amount: '68.00' },
      averageProcessingDays: 10,
    }]);
  });

  it('lets an employer read the reports of an employee of the company only', async () => {
    const { submit, listEmployee } = setUp();
    await submit.execute({ actor: employee, submission: { details, proof: null } });

    await expect(listEmployee.execute({ actor: employer, employeeId: 'u1', criteria: everything })).resolves.toMatchObject({ total: 1 });
    await expect(listEmployee.execute({ actor: { ...employer, companyId: 'c2' }, employeeId: 'u1', criteria: everything }))
      .resolves.toMatchObject({ total: 0 });
    await expect(listEmployee.execute({ actor: colleague, employeeId: 'u1', criteria: everything })).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
