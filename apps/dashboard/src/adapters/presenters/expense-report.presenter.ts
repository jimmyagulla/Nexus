import {
  ExpenseCategorySnapshot,
  ExpenseReportListSnapshot,
  ExpenseReportSnapshot,
  ExpenseReportStatus,
  ExpenseSnapshot,
  ReceiptSnapshot,
} from '@hexagonal-monorepo-template/domain';
import {
  i18n as appI18n,
  type I18n,
} from '../../infrastructure/ui/i18n/i18n';
import { EuroPresenter } from './euro.presenter';

export interface ExpenseFieldsViewModel {
  date: string;
  categoryId: string;
  amount: string;
  vat: string;
  paymentMethod: string;
  description: string;
  assignment: string;
}

export interface ExpenseViewModel {
  id: string;
  date: string;
  category: string;
  amount: string;
  vat: string | null;
  paymentMethod: string;
  description: string;
  assignment: string;
  fields: ExpenseFieldsViewModel;
}

export interface ReceiptViewModel {
  id: string;
  fileName: string;
  size: string;
}

export interface ExpenseReportViewModel {
  id: string;
  label: string;
  status: ExpenseReportStatus;
  statusLabel: string;
  editable: boolean;
  requestable: boolean;
  decidable: boolean;
  reimbursable: boolean;
  reimbursed: string | null;
  total: string;
  receipts: ReceiptViewModel[];
  expenses: ExpenseViewModel[];
}

export interface ExpenseReportListViewModel {
  canCreate: boolean;
  reports: ExpenseReportViewModel[];
  totalAmount: string;
}

export class ExpenseReportPresenter {
  constructor(
    private readonly i18n: I18n = appI18n,
    private readonly euros: EuroPresenter = new EuroPresenter(),
  ) {}

  present(
    snapshot: ExpenseReportSnapshot,
    categories: readonly ExpenseCategorySnapshot[],
  ): ExpenseReportViewModel {
    return {
      id: snapshot.id,
      label: snapshot.label,
      status: snapshot.status,
      statusLabel: this.i18n.messages.expenseReports.status[snapshot.status],
      editable: snapshot.status === ExpenseReportStatus.DRAFT,
      requestable: this.isRequestable(snapshot.status),
      decidable: snapshot.status === ExpenseReportStatus.UNDER_REVIEW,
      reimbursable: snapshot.status === ExpenseReportStatus.VALIDATED,
      reimbursed:
        snapshot.reimbursedAmount === null
          ? null
          : this.euros.present(snapshot.reimbursedAmount),
      total: this.euros.present(snapshot.total),
      receipts: snapshot.receipts.map((receipt) => this.presentReceipt(receipt)),
      expenses: snapshot.expenses.map((expense) =>
        this.presentExpense(expense, categories),
      ),
    };
  }

  presentList(
    list: ExpenseReportListSnapshot,
    categories: readonly ExpenseCategorySnapshot[],
  ): ExpenseReportListViewModel {
    return {
      canCreate: list.canCreate,
      reports: list.reports.map((report) => this.present(report, categories)),
      totalAmount: this.euros.present(list.totalAmount),
    };
  }

  private presentExpense(
    expense: ExpenseSnapshot,
    categories: readonly ExpenseCategorySnapshot[],
  ): ExpenseViewModel {
    return {
      id: expense.id,
      date: this.formatDate(expense.date),
      category: this.categoryLabel(expense.categoryId, categories),
      amount: this.euros.present(expense.amount),
      vat: expense.vat === null ? null : this.euros.present(expense.vat),
      paymentMethod: expense.paymentMethod,
      description: expense.description,
      assignment: expense.assignment,
      fields: this.presentFields(expense),
    };
  }

  private isRequestable(status: ExpenseReportStatus): boolean {
    return (
      status === ExpenseReportStatus.SUBMITTED ||
      status === ExpenseReportStatus.UNDER_REVIEW
    );
  }

  private presentReceipt(receipt: ReceiptSnapshot): ReceiptViewModel {
    return {
      id: receipt.id,
      fileName: receipt.fileName,
      size: this.formatSize(receipt.size),
    };
  }

  private formatSize(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} o`;
    }
    if (bytes < 1024 * 1024) {
      return `${this.rounded(bytes / 1024)} Ko`;
    }
    return `${this.rounded(bytes / (1024 * 1024))} Mo`;
  }

  private rounded(value: number): string {
    return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(
      value,
    );
  }

  private presentFields(expense: ExpenseSnapshot): ExpenseFieldsViewModel {
    return {
      date: expense.date,
      categoryId: expense.categoryId,
      amount: String(expense.amount),
      vat: expense.vat === null ? '' : String(expense.vat),
      paymentMethod: expense.paymentMethod,
      description: expense.description,
      assignment: expense.assignment,
    };
  }

  private categoryLabel(
    categoryId: string,
    categories: readonly ExpenseCategorySnapshot[],
  ): string {
    return (
      categories.find((category) => category.id === categoryId)?.label ??
      categoryId
    );
  }

  private formatDate(isoDate: string): string {
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  }
}
