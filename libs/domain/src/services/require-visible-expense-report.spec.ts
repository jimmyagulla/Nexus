import { ExpenseReport } from '../entities/expense-report';
import { ExpenseReportStatus } from '../entities/expense-report-status';
import { ErrorCode } from '../errors/error-code';
import { ActorContext } from '../identity/actor-context';
import { UserRole } from '../identity/user-role';
import { ExpenseReportLabel } from '../value-objects/expense-report-label';
import { requireVisibleExpenseReport } from './require-visible-expense-report';

const employee: ActorContext = {
  userId: 'e1',
  companyId: 'c1',
  role: UserRole.EMPLOYEE,
};

const employer: ActorContext = {
  userId: 'u1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

function reportWith(status: ExpenseReportStatus): ExpenseReport {
  return new ExpenseReport({
    id: 'r1',
    companyId: 'c1',
    employeeId: 'e1',
    label: ExpenseReportLabel.parse('Lyon'),
    status,
    expenses: [],
  });
}

describe('requireVisibleExpenseReport', () => {
  it.each(Object.values(ExpenseReportStatus))(
    'shows the employee her own report once %s',
    (status) => {
      const report = reportWith(status);

      expect(requireVisibleExpenseReport(report, employee)).toBe(report);
    },
  );

  it('hides the report of another employee', () => {
    expect(() =>
      requireVisibleExpenseReport(reportWith(ExpenseReportStatus.SUBMITTED), {
        ...employee,
        userId: 'e2',
      }),
    ).toThrow(ErrorCode.ACCESS_DENIED);
  });

  it.each([
    ExpenseReportStatus.SUBMITTED,
    ExpenseReportStatus.UNDER_REVIEW,
    ExpenseReportStatus.VALIDATED,
    ExpenseReportStatus.REFUSED,
    ExpenseReportStatus.REIMBURSED,
  ])('shows the employer a report that is %s', (status) => {
    const report = reportWith(status);

    expect(requireVisibleExpenseReport(report, employer)).toBe(report);
  });

  it('hides a draft from the employer', () => {
    expect(() =>
      requireVisibleExpenseReport(
        reportWith(ExpenseReportStatus.DRAFT),
        employer,
      ),
    ).toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('hides a missing report without saying so', () => {
    expect(() => requireVisibleExpenseReport(null, employer)).toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });

  it('hides the report from the accounting firm', () => {
    expect(() =>
      requireVisibleExpenseReport(reportWith(ExpenseReportStatus.SUBMITTED), {
        ...employer,
        role: UserRole.ACCOUNTANT,
      }),
    ).toThrow(ErrorCode.ACCESS_DENIED);
  });
});
