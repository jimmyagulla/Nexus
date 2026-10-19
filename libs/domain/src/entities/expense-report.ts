import { ErrorCode } from '../errors/error-code';
import { CalendarDate } from '../value-objects/calendar-date';
import { DocumentFileFormat } from '../value-objects/document-file-format';
import { ExpenseAmount } from '../value-objects/expense-amount';
import { ExpenseReportCategory } from '../value-objects/expense-report-category';
import { ExpenseReportDescription } from '../value-objects/expense-report-description';
import { ExpenseReportPaymentMethod } from '../value-objects/expense-report-payment-method';
import { ExpenseReportProject } from '../value-objects/expense-report-project';
import {
  ExpenseReportStatus,
  isEditableExpenseReportStatus,
  isProcessedExpenseReportStatus,
} from '../value-objects/expense-report-status';
import { ExpenseVatRate } from '../value-objects/expense-vat-rate';

/** VAT included in the amount: its rate, and the amount it comes to. */
export type ExpenseVat = {
  rate: ExpenseVatRate;
  amount: ExpenseAmount;
};

/** The receipt of an expense report; the file itself lives in the proof storage. */
export type ExpenseReportProof = {
  fileName: string;
  format: DocumentFileFormat;
  sizeBytes: number;
  /** Key of the file in the proof storage. */
  storageKey: string;
};

/** What the owner of an expense report fills in, and may change while it is submitted. */
export type ExpenseReportDetails = {
  /** Day the expense was made. */
  date: CalendarDate;
  category: ExpenseReportCategory;
  paymentMethod: ExpenseReportPaymentMethod;
  /** Amount including VAT. */
  amount: ExpenseAmount;
  vat: ExpenseVat | null;
  description: ExpenseReportDescription;
  project: ExpenseReportProject | null;
};

export type ExpenseReportProps = ExpenseReportDetails & {
  id: string;
  companyId: string;
  /** The employee the expense report belongs to. */
  ownerId: string;
  proof: ExpenseReportProof | null;
  status: ExpenseReportStatus;
  submittedAt: Date;
  /** When it was refunded or refused; null until then. */
  processedAt: Date | null;
};

export class ExpenseReport {
  constructor(private readonly props: ExpenseReportProps) {}

  get id(): string {
    return this.props.id;
  }

  get companyId(): string {
    return this.props.companyId;
  }

  get ownerId(): string {
    return this.props.ownerId;
  }

  get date(): CalendarDate {
    return this.props.date;
  }

  get category(): ExpenseReportCategory {
    return this.props.category;
  }

  get paymentMethod(): ExpenseReportPaymentMethod {
    return this.props.paymentMethod;
  }

  get amount(): ExpenseAmount {
    return this.props.amount;
  }

  get vat(): ExpenseVat | null {
    return this.props.vat;
  }

  get description(): ExpenseReportDescription {
    return this.props.description;
  }

  get project(): ExpenseReportProject | null {
    return this.props.project;
  }

  get proof(): ExpenseReportProof | null {
    return this.props.proof;
  }

  get status(): ExpenseReportStatus {
    return this.props.status;
  }

  get submittedAt(): Date {
    return this.props.submittedAt;
  }

  get processedAt(): Date | null {
    return this.props.processedAt;
  }

  get editable(): boolean {
    return isEditableExpenseReportStatus(this.props.status);
  }

  isOwnedBy(companyId: string | null, userId: string): boolean {
    return this.props.companyId === companyId && this.props.ownerId === userId;
  }

  /**
   * The owner corrects the report while the employer has not taken it up yet;
   * a report being processed, refunded or refused stays as it is.
   */
  revise(details: ExpenseReportDetails, proof: ExpenseReportProof | null): ExpenseReport {
    this.requireEditable();
    return new ExpenseReport({ ...this.props, ...details, proof });
  }

  /** Refuses any change once the employer took the report up. */
  requireEditable(): void {
    if (!this.editable) {
      throw new Error(ErrorCode.ALREADY_PROCESSED);
    }
  }

  /**
   * The employer moves the report along. Reaching a refund or a refusal dates
   * the processing; going back to an open status clears that date.
   */
  changeStatus(status: ExpenseReportStatus, at: Date): ExpenseReport {
    if (status === this.props.status) {
      return this;
    }
    return new ExpenseReport({
      ...this.props,
      status,
      processedAt: isProcessedExpenseReportStatus(status) ? at : null,
    });
  }
}
