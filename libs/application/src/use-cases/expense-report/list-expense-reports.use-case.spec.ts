import {
  InMemoryEmployeeRepository,
  InMemoryExpenseReportRepository,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  Employee,
  EmployeeStatus,
  ErrorCode,
  ExpenseDetails,
  ExpenseReportLabel,
  ReceiptDetails,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { ListExpenseReportsUseCase } from './list-expense-reports.use-case';

const employee: ActorContext = {
  userId: 'e1',
  companyId: 'c1',
  role: UserRole.EMPLOYEE,
};

async function setup(status: EmployeeStatus = EmployeeStatus.ACTIVE) {
  const reports = new InMemoryExpenseReportRepository();
  await reports.insert('c1', 'e1', ExpenseReportLabel.parse('Lyon'));
  await reports.insert('c1', 'e2', ExpenseReportLabel.parse('Paris'));
  await reports.insert('c2', 'e1', ExpenseReportLabel.parse('Nantes'));
  return new ListExpenseReportsUseCase(
    new InMemoryEmployeeRepository([
      new Employee('e1', 'c1', status),
      new Employee('e9', 'c1', EmployeeStatus.ACTIVE),
    ]),
    reports,
  );
}

describe('ListExpenseReportsUseCase', () => {
  it('lists only the reports of the employee', async () => {
    const useCase = await setup();

    const { reports } = await useCase.execute({
      actor: employee,
      companyId: 'c1',
    });

    expect(reports.map((report) => report.label)).toEqual(['Lyon']);
  });

  it('lists nothing for an employee without report', async () => {
    const useCase = await setup();

    await expect(
      useCase.execute({
        actor: { ...employee, userId: 'e9' },
        companyId: 'c1',
      }),
    ).resolves.toEqual({ canCreate: true, reports: [], totalAmount: 0 });
  });

  it('lets an active employee create a report', async () => {
    const useCase = await setup();

    expect(
      (await useCase.execute({ actor: employee, companyId: 'c1' })).canCreate,
    ).toBe(true);
  });

  it('does not offer to create a report to an inactive employee', async () => {
    const useCase = await setup(EmployeeStatus.INACTIVE);

    const list = await useCase.execute({ actor: employee, companyId: 'c1' });

    expect(list.canCreate).toBe(false);
    expect(list.reports.map((report) => report.label)).toEqual(['Lyon']);
  });

  it('refuses another company', async () => {
    const useCase = await setup();

    await expect(
      useCase.execute({ actor: employee, companyId: 'c2' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  describe('filtering', () => {
    async function seeded() {
      const reports = new InMemoryExpenseReportRepository();
      const make = async (
        employeeId: string,
        label: string,
        date: string,
        amount: number,
        submit: boolean,
      ) => {
        const created = await reports.insert(
          'c1',
          employeeId,
          ExpenseReportLabel.parse(label),
        );
        await reports.insertExpense(
          created.id,
          ExpenseDetails.parse({
            date,
            categoryId: 'train',
            amount,
            vat: null,
            paymentMethod: 'Carte',
            description: 'Billet',
            assignment: 'Projet X',
          }),
        );
        if (submit) {
          await reports.insertReceipt(
            created.id,
            ReceiptDetails.parse({
              fileName: 'ticket.pdf',
              mimeType: 'application/pdf',
              content: new Uint8Array([1]),
              expenseId: null,
            }),
          );
          const stored = await reports.findById('c1', created.id);
          if (stored === null) {
            throw new Error('unreachable');
          }
          await reports.save(stored.submit());
        }
      };
      await make('e1', 'Octobre e1', '2026-10-05', 45, true);
      await make('e1', 'Septembre e1', '2026-09-05', 100, false);
      await make('e2', 'Octobre e2', '2026-10-06', 300, true);
      return new ListExpenseReportsUseCase(
        new InMemoryEmployeeRepository([
          new Employee('e1', 'c1', EmployeeStatus.ACTIVE),
        ]),
        reports,
      );
    }

    it('filters the reports of the employee by period', async () => {
      const useCase = await seeded();

      const list = await useCase.execute({
        actor: employee,
        companyId: 'c1',
        filter: { from: '2026-10-01', to: '2026-10-31' },
      });

      expect(list.reports.map((report) => report.label)).toEqual([
        'Octobre e1',
      ]);
    });

    it('filters the reports of the employee by status', async () => {
      const useCase = await seeded();

      const list = await useCase.execute({
        actor: employee,
        companyId: 'c1',
        filter: { status: 'DRAFT' },
      });

      expect(list.reports.map((report) => report.label)).toEqual([
        'Septembre e1',
      ]);
    });

    it('never mixes in the reports of another employee, even when asked for them', async () => {
      const useCase = await seeded();

      const list = await useCase.execute({
        actor: employee,
        companyId: 'c1',
        filter: { employeeId: 'e2' },
      });

      expect(list.reports).toEqual([]);
      expect(list.totalAmount).toBe(0);
    });

    it('sums only the filtered reports of the employee', async () => {
      const useCase = await seeded();

      const list = await useCase.execute({
        actor: employee,
        companyId: 'c1',
        filter: { minAmount: 40 },
      });

      expect(list.reports.map((report) => report.label)).toEqual([
        'Octobre e1',
        'Septembre e1',
      ]);
      expect(list.totalAmount).toBe(145);
    });

    it('lets the employer filter by employee, period, amount and status', async () => {
      const useCase = await seeded();
      const employer = { userId: 'u1', companyId: 'c1', role: UserRole.EMPLOYER };

      const list = await useCase.execute({
        actor: employer,
        companyId: 'c1',
        filter: {
          employeeId: 'e2',
          from: '2026-10-01',
          to: '2026-10-31',
          minAmount: 200,
          status: 'SUBMITTED',
        },
      });

      expect(list.reports.map((report) => report.label)).toEqual(['Octobre e2']);
      expect(list.totalAmount).toBe(300);
    });

    it('shows the employer the filtered amount of one employee only', async () => {
      const useCase = await seeded();
      const employer = { userId: 'u1', companyId: 'c1', role: UserRole.EMPLOYER };

      const list = await useCase.execute({
        actor: employer,
        companyId: 'c1',
        filter: { employeeId: 'e1' },
      });

      expect(list.reports.map((report) => report.label)).toEqual(['Octobre e1']);
      expect(list.totalAmount).toBe(45);
    });

    it('refuses a period that ends before it starts', async () => {
      const useCase = await seeded();

      await expect(
        useCase.execute({
          actor: employee,
          companyId: 'c1',
          filter: { from: '2026-10-31', to: '2026-10-01' },
        }),
      ).rejects.toThrow(ErrorCode.INVALID_PERIOD);
    });
  });

  it('lists the submitted reports of every employee for the employer, drafts left out', async () => {
    const reports = new InMemoryExpenseReportRepository();
    await reports.insert('c1', 'e1', ExpenseReportLabel.parse('Brouillon'));
    const submitted = await reports.insert(
      'c1',
      'e2',
      ExpenseReportLabel.parse('Soumise'),
    );
    await reports.insertExpense(
      submitted.id,
      ExpenseDetails.parse({
        date: '2026-10-05',
        categoryId: 'train',
        amount: 68,
        vat: null,
        paymentMethod: 'Carte',
        description: 'Billet',
        assignment: 'Projet X',
      }),
    );
    await reports.insertReceipt(
      submitted.id,
      ReceiptDetails.parse({
        fileName: 'ticket.pdf',
        mimeType: 'application/pdf',
        content: new Uint8Array([1]),
        expenseId: null,
      }),
    );
    const stored = await reports.findById('c1', submitted.id);
    if (stored === null) {
      throw new Error('unreachable');
    }
    await reports.save(stored.submit());
    await reports.insert('c2', 'e9', ExpenseReportLabel.parse('Autre société'));
    const useCase = new ListExpenseReportsUseCase(
      new InMemoryEmployeeRepository(),
      reports,
    );

    const list = await useCase.execute({
      actor: { ...employee, userId: 'u1', role: UserRole.EMPLOYER },
      companyId: 'c1',
    });

    expect(list.canCreate).toBe(false);
    expect(list.reports.map((report) => report.label)).toEqual(['Soumise']);
  });

  it('refuses the accounting firm', async () => {
    const useCase = await setup();

    await expect(
      useCase.execute({
        actor: { ...employee, role: UserRole.ACCOUNTANT },
        companyId: 'c1',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
