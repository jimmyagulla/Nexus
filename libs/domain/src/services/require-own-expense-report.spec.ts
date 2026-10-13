import { ExpenseReport } from '../entities/expense-report';
import { ErrorCode } from '../errors/error-code';
import { ActorContext } from '../identity/actor-context';
import { UserRole } from '../identity/user-role';
import { ExpenseReportLabel } from '../value-objects/expense-report-label';
import { requireOwnExpenseReport } from './require-own-expense-report';

const employee: ActorContext = {
  userId: 'e1',
  companyId: 'c1',
  role: UserRole.EMPLOYEE,
};

const report = ExpenseReport.create(
  'r1',
  'c1',
  'e1',
  ExpenseReportLabel.parse('Lyon'),
);

describe('requireOwnExpenseReport', () => {
  it('returns the report of the employee', () => {
    expect(requireOwnExpenseReport(report, employee)).toBe(report);
  });

  it('refuses the report of another employee', () => {
    expect(() =>
      requireOwnExpenseReport(report, { ...employee, userId: 'e2' }),
    ).toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses a missing report without saying so', () => {
    expect(() => requireOwnExpenseReport(null, employee)).toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });
});
