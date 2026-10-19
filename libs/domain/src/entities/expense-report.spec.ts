import { ErrorCode } from '../errors/error-code';
import { UserRole } from '../identity/user-role';
import {
  requireCompanyExpenseReport,
  requireEmployerCompany,
  requireOwnedExpenseReport,
  requireReadableExpenseReport,
} from '../services/require-expense-report-access';
import { CalendarDate } from '../value-objects/calendar-date';
import { ExpenseAmount } from '../value-objects/expense-amount';
import { ExpenseReportCategory } from '../value-objects/expense-report-category';
import { ExpenseReportDescription } from '../value-objects/expense-report-description';
import { ExpenseReportPaymentMethod } from '../value-objects/expense-report-payment-method';
import { ExpenseReportStatus } from '../value-objects/expense-report-status';
import { ExpenseReport, ExpenseReportDetails } from './expense-report';

const details: ExpenseReportDetails = {
  date: CalendarDate.parse('2026-09-28'),
  category: ExpenseReportCategory.TRAVEL,
  paymentMethod: ExpenseReportPaymentMethod.PERSONAL_CARD,
  amount: ExpenseAmount.parse('68'),
  vat: null,
  description: ExpenseReportDescription.parse('Montpellier – Lyon'),
  project: null,
};

function report(status: ExpenseReportStatus = ExpenseReportStatus.SUBMITTED): ExpenseReport {
  return new ExpenseReport({
    ...details,
    id: 'e1',
    companyId: 'c1',
    ownerId: 'u1',
    proof: null,
    status,
    submittedAt: new Date('2026-09-28T10:00:00Z'),
    processedAt: null,
  });
}

const processedAt = new Date('2026-10-08T09:00:00Z');

describe('ExpenseReport', () => {
  it('lets its owner correct it while it is submitted', () => {
    const revised = report().revise(
      { ...details, description: ExpenseReportDescription.parse('Lyon – Montpellier') },
      { fileName: 'billet.pdf', format: 'PDF', sizeBytes: 12, storageKey: 'k' },
    );

    expect([revised.description.value, revised.proof?.fileName, revised.status]).toEqual([
      'Lyon – Montpellier',
      'billet.pdf',
      ExpenseReportStatus.SUBMITTED,
    ]);
  });

  it('refuses a correction once the employer took it up', () => {
    for (const status of [ExpenseReportStatus.IN_PROGRESS, ExpenseReportStatus.REFUNDED, ExpenseReportStatus.REJECTED]) {
      expect(() => report(status).revise(details, null)).toThrow(ErrorCode.ALREADY_PROCESSED);
    }
  });

  it('dates its processing when it is refunded or refused', () => {
    expect(report().changeStatus(ExpenseReportStatus.REFUNDED, processedAt).processedAt).toEqual(processedAt);
    expect(report().changeStatus(ExpenseReportStatus.REJECTED, processedAt).processedAt).toEqual(processedAt);
    expect(report().changeStatus(ExpenseReportStatus.IN_PROGRESS, processedAt).processedAt).toBeNull();
  });

  it('clears the processing date when it goes back to an open status', () => {
    const refunded = report().changeStatus(ExpenseReportStatus.REFUNDED, processedAt);

    expect(refunded.changeStatus(ExpenseReportStatus.IN_PROGRESS, processedAt).processedAt).toBeNull();
  });

  it('keeps its processing date when its status does not change', () => {
    const refunded = report().changeStatus(ExpenseReportStatus.REFUNDED, processedAt);

    expect(refunded.changeStatus(ExpenseReportStatus.REFUNDED, new Date()).processedAt).toEqual(processedAt);
  });
});

describe('expense report access', () => {
  const owner = { userId: 'u1', companyId: 'c1', role: UserRole.EMPLOYEE };
  const colleague = { userId: 'u2', companyId: 'c1', role: UserRole.EMPLOYEE };
  const employer = { userId: 'boss', companyId: 'c1', role: UserRole.EMPLOYER };
  const otherEmployer = { userId: 'boss2', companyId: 'c2', role: UserRole.EMPLOYER };

  it('hands its report to the owner only', () => {
    expect(requireOwnedExpenseReport(report(), owner).id).toBe('e1');
    expect(() => requireOwnedExpenseReport(report(), colleague)).toThrow(ErrorCode.ACCESS_DENIED);
    expect(() => requireOwnedExpenseReport(report(), employer)).toThrow(ErrorCode.ACCESS_DENIED);
    expect(() => requireOwnedExpenseReport(null, owner)).toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('lets the owner and the employers of its company read it', () => {
    expect(requireReadableExpenseReport(report(), owner).id).toBe('e1');
    expect(requireReadableExpenseReport(report(), employer).id).toBe('e1');
    expect(() => requireReadableExpenseReport(report(), colleague)).toThrow(ErrorCode.ACCESS_DENIED);
    expect(() => requireReadableExpenseReport(report(), otherEmployer)).toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('keeps the handling of a report to the employers of its company', () => {
    expect(requireCompanyExpenseReport(report(), employer).id).toBe('e1');
    expect(() => requireCompanyExpenseReport(report(), owner)).toThrow(ErrorCode.ACCESS_DENIED);
    expect(() => requireCompanyExpenseReport(report(), otherEmployer)).toThrow(ErrorCode.ACCESS_DENIED);
    expect(() => requireCompanyExpenseReport(null, employer)).toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses an employer outside any company', () => {
    expect(requireEmployerCompany(employer)).toBe('c1');
    expect(() => requireEmployerCompany({ ...employer, companyId: null })).toThrow(ErrorCode.ACCESS_DENIED);
    expect(() => requireEmployerCompany(owner)).toThrow(ErrorCode.ACCESS_DENIED);
  });
});
