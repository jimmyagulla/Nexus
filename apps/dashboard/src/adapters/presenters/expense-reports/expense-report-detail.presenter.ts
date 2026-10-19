import {
  ExpenseReportSummary,
  isExpenseVatRate,
} from '@hexagonal-monorepo-template/domain';
import {
  i18n as appI18n,
  type I18n,
} from '../../../infrastructure/ui/i18n/i18n';
import type { StatusViewModel } from '../display.types';
import type { FileSizePresenter } from '../documents/file-size.presenter';
import type { ExpenseAmountPresenter } from './expense-amount.presenter';
import {
  EXPENSE_REPORT_CATEGORY_ICONS,
  EXPENSE_REPORT_PROOF_ICONS,
  EXPENSE_REPORT_STATUS_TONES,
} from './expense-report-display';

export interface ExpenseReportDetailFieldModel {
  label: string;
  value: string;
}

export interface ExpenseReportDetailModel {
  id: string;
  title: string;
  /** Remix Icon class of the category. */
  icon: string;
  status: StatusViewModel;
  editable: boolean;
  /** Why the report can no longer be changed; null while it can. */
  lockedNote: string | null;
  fields: ExpenseReportDetailFieldModel[];
  /** The receipt: name, "214 Ko · PDF" and icon; null without one. */
  proof: { name: string; details: string; icon: string } | null;
  noProofLabel: string;
}

/** Presents the full detail of an expense report, in its preview modal. */
export class ExpenseReportDetailPresenter {
  constructor(
    private readonly amounts: ExpenseAmountPresenter,
    private readonly sizes: FileSizePresenter,
    private readonly i18n: I18n = appI18n,
  ) {}

  present(item: ExpenseReportSummary): ExpenseReportDetailModel {
    const labels = this.i18n.messages.expenseReports;
    const detail = labels.detail;
    return {
      id: item.id,
      title: item.description,
      icon: EXPENSE_REPORT_CATEGORY_ICONS[item.category],
      status: { label: labels.statuses[item.status], tone: EXPENSE_REPORT_STATUS_TONES[item.status] },
      editable: item.editable,
      lockedNote: item.editable ? null : detail.locked,
      fields: [
        { label: detail.date, value: this.presentDay(item.date) },
        { label: detail.category, value: labels.categories[item.category] },
        { label: detail.amount, value: this.amounts.present(item.amount) },
        { label: detail.vat, value: this.presentVat(item) },
        { label: detail.paymentMethod, value: labels.paymentMethods[item.paymentMethod] },
        { label: detail.project, value: item.project ?? labels.list.noProject },
        { label: detail.submittedAt, value: this.presentInstant(item.submittedAt) },
        {
          label: detail.processedAt,
          value: item.processedAt === null ? detail.notProcessed : this.presentInstant(item.processedAt),
        },
      ],
      proof:
        item.proof === null
          ? null
          : {
              name: item.proof.fileName,
              details: `${this.sizes.present(item.proof.sizeBytes)} · ${this.i18n.messages.documents.formats[item.proof.format]}`,
              icon: EXPENSE_REPORT_PROOF_ICONS[item.proof.format] ?? 'ri-file-line',
            },
      noProofLabel: detail.noProof,
    };
  }

  private presentVat(item: ExpenseReportSummary): string {
    const vat = this.i18n.messages.expenseReports.vat;
    if (item.vatRate === null || item.vatAmount === null || !isExpenseVatRate(item.vatRate)) {
      return vat.none;
    }
    return vat.rateWithAmount
      .replace('{rate}', String(item.vatRate))
      .replace('{amount}', this.amounts.present(item.vatAmount));
  }

  /** `aaaa-mm-jj` → `jj/mm/aaaa`. */
  private presentDay(day: string): string {
    const [year, month, date] = day.split('-');
    return `${date}/${month}/${year}`;
  }

  /** `jj/mm/aaaa`, in the time zone of the device. */
  private presentInstant(instant: string): string {
    const date = new Date(instant);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}/${date.getFullYear()}`;
  }
}
