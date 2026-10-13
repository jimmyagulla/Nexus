import { ErrorCode } from '../errors/error-code';
import { CalendarDate } from '../value-objects/calendar-date';
import { ExpenseReportLabel } from '../value-objects/expense-report-label';
import { Expense } from './expense';
import { ExpenseDetails } from './expense-details';
import { ExpenseReport } from './expense-report';
import { ExpenseReportStatus } from './expense-report-status';
import { Receipt } from './receipt';
import { ReceiptDetails } from './receipt-details';

function expense(id: string, categoryId: string, amount: number): Expense {
  return new Expense(
    id,
    ExpenseDetails.parse({
      date: '2026-10-05',
      categoryId,
      amount,
      vat: null,
      paymentMethod: 'Carte',
      description: 'Dépense',
      assignment: 'Client',
    }),
  );
}

function receipt(id: string, expenseId: string | null): Receipt {
  return new Receipt(
    id,
    ReceiptDetails.parse({
      fileName: 'ticket.pdf',
      mimeType: 'application/pdf',
      content: new Uint8Array([1, 2, 3]),
      expenseId,
    }),
  );
}

function draftProps() {
  return {
    id: 'r1',
    companyId: 'c1',
    employeeId: 'e1',
    label: ExpenseReportLabel.parse('Déplacement Lyon'),
    status: ExpenseReportStatus.DRAFT,
    expenses: [] as readonly Expense[],
  };
}

describe('ExpenseReport', () => {
  it('is created as a draft without any expense', () => {
    const report = ExpenseReport.create(
      'r1',
      'c1',
      'e1',
      ExpenseReportLabel.parse('Déplacement Lyon'),
    );

    expect(report.status).toBe(ExpenseReportStatus.DRAFT);
    expect(report.expenses).toEqual([]);
    expect(report.employeeId).toBe('e1');
    expect(report.companyId).toBe('c1');
    expect(report.label.value).toBe('Déplacement Lyon');
  });

  it('gathers several expenses', () => {
    const report = new ExpenseReport(draftProps())
      .addExpense(expense('x1', 'restaurant', 45))
      .addExpense(expense('x2', 'parking', 12))
      .addExpense(expense('x3', 'train', 68));

    expect(report.expenses.map((item) => item.details.categoryId)).toEqual([
      'restaurant',
      'parking',
      'train',
    ]);
    expect(report.expenses.map((item) => item.details.amount.euros)).toEqual([
      45, 12, 68,
    ]);
  });

  it('keeps the original report untouched when an expense is added', () => {
    const original = new ExpenseReport(draftProps());

    original.addExpense(expense('x1', 'restaurant', 45));

    expect(original.expenses).toEqual([]);
  });

  it.each([
    ExpenseReportStatus.SUBMITTED,
    ExpenseReportStatus.UNDER_REVIEW,
    ExpenseReportStatus.VALIDATED,
    ExpenseReportStatus.REFUSED,
    ExpenseReportStatus.REIMBURSED,
  ])('no longer accepts an expense once %s', (status) => {
    const report = new ExpenseReport({ ...draftProps(), status });

    expect(() => report.addExpense(expense('x1', 'train', 68))).toThrow(
      ErrorCode.REQUEST_ALREADY_PROCESSED,
    );
  });

  it('totals the amounts of its expenses', () => {
    const report = new ExpenseReport(draftProps())
      .addExpense(expense('x1', 'restaurant', 45))
      .addExpense(expense('x2', 'parking', 12))
      .addExpense(expense('x3', 'train', 68));

    expect(report.total().euros).toBe(125);
  });

  it('totals nothing for a report without expense', () => {
    expect(new ExpenseReport(draftProps()).total().euros).toBe(0);
  });

  it('keeps the cents of the total exact', () => {
    const report = new ExpenseReport(draftProps())
      .addExpense(expense('x1', 'restaurant', 0.1))
      .addExpense(expense('x2', 'parking', 0.2));

    expect(report.total().cents).toBe(30);
  });

  it('lowers the total when an expense is removed', () => {
    const report = new ExpenseReport(draftProps())
      .addExpense(expense('x1', 'restaurant', 45))
      .addExpense(expense('x2', 'parking', 12))
      .addExpense(expense('x3', 'train', 68))
      .removeExpense('x3');

    expect(report.total().euros).toBe(57);
    expect(report.expenses.map((item) => item.id)).toEqual(['x1', 'x2']);
  });

  it('recomputes the total when an expense is modified', () => {
    const report = new ExpenseReport(draftProps())
      .addExpense(expense('x1', 'restaurant', 45))
      .addExpense(expense('x2', 'parking', 12))
      .updateExpense(expense('x2', 'parking', 20));

    expect(report.total().euros).toBe(65);
    expect(report.expenses.map((item) => item.id)).toEqual(['x1', 'x2']);
  });

  it('refuses to modify an expense it does not hold', () => {
    expect(() =>
      new ExpenseReport(draftProps()).updateExpense(expense('x9', 'train', 1)),
    ).toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses to remove an expense it does not hold', () => {
    expect(() => new ExpenseReport(draftProps()).removeExpense('x9')).toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });

  it.each([
    ExpenseReportStatus.SUBMITTED,
    ExpenseReportStatus.UNDER_REVIEW,
    ExpenseReportStatus.VALIDATED,
    ExpenseReportStatus.REFUSED,
    ExpenseReportStatus.REIMBURSED,
  ])('no longer lets the employee modify or remove an expense once %s', (status) => {
    const report = new ExpenseReport({
      ...draftProps(),
      status,
      expenses: [expense('x1', 'train', 68)],
    });

    expect(() => report.updateExpense(expense('x1', 'train', 70))).toThrow(
      ErrorCode.REQUEST_ALREADY_PROCESSED,
    );
    expect(() => report.removeExpense('x1')).toThrow(
      ErrorCode.REQUEST_ALREADY_PROCESSED,
    );
  });

  it('starts without any receipt', () => {
    expect(new ExpenseReport(draftProps()).receipts).toEqual([]);
  });

  it('keeps a receipt on the report', () => {
    const report = new ExpenseReport(draftProps()).attachReceipt(
      receipt('f1', null),
    );

    expect(report.receipts.map((item) => item.id)).toEqual(['f1']);
  });

  it('keeps a receipt that proves one expense', () => {
    const report = new ExpenseReport(draftProps())
      .addExpense(expense('x1', 'train', 68))
      .attachReceipt(receipt('f1', 'x1'));

    expect(report.receipts[0]?.details.expenseId).toBe('x1');
  });

  it('refuses a receipt for an expense the report does not hold', () => {
    expect(() =>
      new ExpenseReport(draftProps()).attachReceipt(receipt('f1', 'x9')),
    ).toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('keeps a receipt on the report when the expense it proved is removed', () => {
    const report = new ExpenseReport(draftProps())
      .addExpense(expense('x1', 'train', 68))
      .attachReceipt(receipt('f1', 'x1'))
      .removeExpense('x1');

    expect(report.receipts.map((item) => item.id)).toEqual(['f1']);
    expect(report.receipts[0]?.details.expenseId).toBeNull();
  });

  it('keeps the receipts when an expense is removed', () => {
    const report = new ExpenseReport(draftProps())
      .addExpense(expense('x1', 'train', 68))
      .attachReceipt(receipt('f1', null))
      .removeExpense('x1');

    expect(report.receipts.map((item) => item.id)).toEqual(['f1']);
  });

  it.each([
    ExpenseReportStatus.SUBMITTED,
    ExpenseReportStatus.UNDER_REVIEW,
    ExpenseReportStatus.VALIDATED,
    ExpenseReportStatus.REFUSED,
    ExpenseReportStatus.REIMBURSED,
  ])('no longer accepts a receipt once %s', (status) => {
    const report = new ExpenseReport({ ...draftProps(), status });

    expect(() => report.attachReceipt(receipt('f1', null))).toThrow(
      ErrorCode.REQUEST_ALREADY_PROCESSED,
    );
  });

  it('finds one of its receipts', () => {
    const report = new ExpenseReport(draftProps()).attachReceipt(
      receipt('f1', null),
    );

    expect(report.requireReceipt('f1').id).toBe('f1');
  });

  it('refuses a receipt it does not hold', () => {
    expect(() => new ExpenseReport(draftProps()).requireReceipt('f9')).toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });

  it('is submitted once it holds an expense and a receipt', () => {
    const submitted = new ExpenseReport(draftProps())
      .addExpense(expense('x1', 'train', 68))
      .attachReceipt(receipt('f1', null))
      .submit();

    expect(submitted.status).toBe(ExpenseReportStatus.SUBMITTED);
  });

  it('counts a receipt attached to an expense as a receipt of the report', () => {
    const submitted = new ExpenseReport(draftProps())
      .addExpense(expense('x1', 'train', 68))
      .attachReceipt(receipt('f1', 'x1'))
      .submit();

    expect(submitted.status).toBe(ExpenseReportStatus.SUBMITTED);
  });

  it('refuses to be submitted without any receipt and stays a draft', () => {
    const report = new ExpenseReport(draftProps()).addExpense(
      expense('x1', 'train', 68),
    );

    expect(() => report.submit()).toThrow(ErrorCode.MISSING_DOCUMENT);
    expect(report.status).toBe(ExpenseReportStatus.DRAFT);
  });

  it('refuses to be submitted without any expense', () => {
    const report = new ExpenseReport(draftProps()).attachReceipt(
      receipt('f1', null),
    );

    expect(() => report.submit()).toThrow(ErrorCode.REQUIRED_INFORMATION);
  });

  it.each([
    ExpenseReportStatus.SUBMITTED,
    ExpenseReportStatus.UNDER_REVIEW,
    ExpenseReportStatus.VALIDATED,
    ExpenseReportStatus.REFUSED,
    ExpenseReportStatus.REIMBURSED,
  ])('cannot be submitted again once %s', (status) => {
    const report = new ExpenseReport({
      ...draftProps(),
      status,
      expenses: [expense('x1', 'train', 68)],
      receipts: [receipt('f1', null)],
    });

    expect(() => report.submit()).toThrow(ErrorCode.REQUEST_ALREADY_PROCESSED);
  });

  describe('processing by the employer', () => {
    function inStatus(status: ExpenseReportStatus): ExpenseReport {
      return new ExpenseReport({
        ...draftProps(),
        status,
        expenses: [expense('x1', 'train', 68)],
        receipts: [receipt('f1', null)],
      });
    }

    it('goes under review when the employer starts the processing', () => {
      expect(
        inStatus(ExpenseReportStatus.SUBMITTED).startReview().status,
      ).toBe(ExpenseReportStatus.UNDER_REVIEW);
    });

    it('stays under review when the employer opens it again', () => {
      expect(
        inStatus(ExpenseReportStatus.UNDER_REVIEW).startReview().status,
      ).toBe(ExpenseReportStatus.UNDER_REVIEW);
    });

    it.each([
      ExpenseReportStatus.VALIDATED,
      ExpenseReportStatus.REFUSED,
      ExpenseReportStatus.REIMBURSED,
    ])('keeps its status when the employer opens it once %s', (status) => {
      expect(inStatus(status).startReview().status).toBe(status);
    });

    it('cannot start the review of a draft', () => {
      expect(() =>
        inStatus(ExpenseReportStatus.DRAFT).startReview(),
      ).toThrow(ErrorCode.ACCESS_DENIED);
    });

    it('is validated from under review', () => {
      expect(inStatus(ExpenseReportStatus.UNDER_REVIEW).validate().status).toBe(
        ExpenseReportStatus.VALIDATED,
      );
    });

    it('is refused from under review', () => {
      expect(inStatus(ExpenseReportStatus.UNDER_REVIEW).refuse().status).toBe(
        ExpenseReportStatus.REFUSED,
      );
    });

    it.each([
      ExpenseReportStatus.DRAFT,
      ExpenseReportStatus.SUBMITTED,
      ExpenseReportStatus.VALIDATED,
      ExpenseReportStatus.REFUSED,
      ExpenseReportStatus.REIMBURSED,
    ])('cannot be validated nor refused when %s', (status) => {
      const report = inStatus(status);

      expect(() => report.validate()).toThrow(
        ErrorCode.REQUEST_ALREADY_PROCESSED,
      );
      expect(() => report.refuse()).toThrow(
        ErrorCode.REQUEST_ALREADY_PROCESSED,
      );
    });

    it.each([
      ExpenseReportStatus.SUBMITTED,
      ExpenseReportStatus.UNDER_REVIEW,
    ])('accepts a request for information when %s without changing status', (status) => {
      const report = inStatus(status);

      expect(report.requestInformation()).toBe(report);
    });

    it.each([
      ExpenseReportStatus.DRAFT,
      ExpenseReportStatus.VALIDATED,
      ExpenseReportStatus.REFUSED,
      ExpenseReportStatus.REIMBURSED,
    ])('refuses a request for information when %s', (status) => {
      expect(() => inStatus(status).requestInformation()).toThrow(
        ErrorCode.REQUEST_ALREADY_PROCESSED,
      );
    });
  });

  it('exposes the date of an expense as a calendar date', () => {
    expect(expense('x1', 'train', 68).details.date).toEqual(
      CalendarDate.parse('2026-10-05'),
    );
  });
});

describe('ExpenseReportLabel', () => {
  it('refuses a blank label', () => {
    expect(() => ExpenseReportLabel.parse('  ')).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });

  it('trims the label', () => {
    expect(ExpenseReportLabel.parse(' Lyon ').value).toBe('Lyon');
  });
});
