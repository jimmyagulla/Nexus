import { ErrorCode } from '../errors/error-code';
import { CalendarDate } from '../value-objects/calendar-date';
import { ExpenseReport } from './expense-report';
import { ExpenseReportStatus } from './expense-report-status';

export type ExpenseReportFilterInput = {
  employeeId?: string;
  status?: ExpenseReportStatus;
  from?: string;
  to?: string;
  minAmount?: number;
  maxAmount?: number;
};

export class ExpenseReportFilter {
  private constructor(
    private readonly criteria: ExpenseReportFilterInput,
    private readonly from: CalendarDate | null,
    private readonly to: CalendarDate | null,
  ) {}

  static parse(input: ExpenseReportFilterInput): ExpenseReportFilter {
    const from = input.from === undefined ? null : CalendarDate.parse(input.from);
    const to = input.to === undefined ? null : CalendarDate.parse(input.to);
    if (from !== null && to !== null && to.value < from.value) {
      throw new Error(ErrorCode.INVALID_PERIOD);
    }
    return new ExpenseReportFilter(input, from, to);
  }

  matches(report: ExpenseReport): boolean {
    return (
      this.matchesEmployee(report) &&
      this.matchesStatus(report) &&
      this.matchesPeriod(report) &&
      this.matchesAmount(report)
    );
  }

  private matchesEmployee(report: ExpenseReport): boolean {
    return (
      this.criteria.employeeId === undefined ||
      report.employeeId === this.criteria.employeeId
    );
  }

  private matchesStatus(report: ExpenseReport): boolean {
    return (
      this.criteria.status === undefined || report.status === this.criteria.status
    );
  }

  private matchesPeriod(report: ExpenseReport): boolean {
    if (this.from === null && this.to === null) {
      return true;
    }
    return report.expenses.some((expense) => {
      const date = expense.details.date.value;
      return (
        (this.from === null || date >= this.from.value) &&
        (this.to === null || date <= this.to.value)
      );
    });
  }

  private matchesAmount(report: ExpenseReport): boolean {
    const total = report.total().euros;
    return (
      (this.criteria.minAmount === undefined || total >= this.criteria.minAmount) &&
      (this.criteria.maxAmount === undefined || total <= this.criteria.maxAmount)
    );
  }
}
