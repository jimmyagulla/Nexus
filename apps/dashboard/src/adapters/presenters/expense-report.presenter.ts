import {
  ExpenseCategorySnapshot,
  ExpenseReportListSnapshot,
  ExpenseReportSnapshot,
  ExpenseReportStatus,
  ExpenseSnapshot,
} from '@hexagonal-monorepo-template/domain';
import {
  i18n as appI18n,
  type I18n,
} from '../../infrastructure/ui/i18n/i18n';
import { EuroPresenter } from './euro.presenter';

export interface ExpenseViewModel {
  id: string;
  date: string;
  category: string;
  amount: string;
  vat: string | null;
  paymentMethod: string;
  description: string;
  assignment: string;
}

export interface ExpenseReportViewModel {
  id: string;
  label: string;
  status: ExpenseReportStatus;
  statusLabel: string;
  editable: boolean;
  expenses: ExpenseViewModel[];
}

export interface ExpenseReportListViewModel {
  canCreate: boolean;
  reports: ExpenseReportViewModel[];
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
