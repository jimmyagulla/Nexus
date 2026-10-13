import { InMemoryExpenseReportRepository } from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  ErrorCode,
  ExpenseReportLabel,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { GetExpenseReportUseCase } from './get-expense-report.use-case';

const employee: ActorContext = {
  userId: 'e1',
  companyId: 'c1',
  role: UserRole.EMPLOYEE,
};

async function setup() {
  const reports = new InMemoryExpenseReportRepository();
  const report = await reports.insert(
    'c1',
    'e1',
    ExpenseReportLabel.parse('Déplacement Lyon'),
  );
  return { useCase: new GetExpenseReportUseCase(reports), report };
}

describe('GetExpenseReportUseCase', () => {
  it('shows the employee her own draft report', async () => {
    const { useCase, report } = await setup();

    await expect(
      useCase.execute({ actor: employee, companyId: 'c1', reportId: report.id }),
    ).resolves.toMatchObject({
      id: report.id,
      label: 'Déplacement Lyon',
      status: 'DRAFT',
    });
  });

  it('hides the report of another employee', async () => {
    const { useCase, report } = await setup();

    await expect(
      useCase.execute({
        actor: { ...employee, userId: 'e2' },
        companyId: 'c1',
        reportId: report.id,
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('hides an unknown report', async () => {
    const { useCase } = await setup();

    await expect(
      useCase.execute({ actor: employee, companyId: 'c1', reportId: 'nope' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('hides the report from another company', async () => {
    const { useCase, report } = await setup();

    await expect(
      useCase.execute({
        actor: { ...employee, companyId: 'c2' },
        companyId: 'c2',
        reportId: report.id,
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses an actor reading another company than hers', async () => {
    const { useCase, report } = await setup();

    await expect(
      useCase.execute({ actor: employee, companyId: 'c2', reportId: report.id }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
