import {
  ACCEPTED_EXPENSE_REPORT_PROOF_EXTENSIONS,
  ACCEPTED_EXPENSE_REPORT_PROOF_MIME_TYPES,
  EXPENSE_REPORT_DESCRIPTION_MAX_LENGTH,
  EXPENSE_REPORT_PAYMENT_METHODS,
  EXPENSE_REPORT_PROJECT_MAX_LENGTH,
  ExpenseReportPaymentMethod,
  ExpenseReportProjectCount,
  ExpenseReportSummary,
} from '@hexagonal-monorepo-template/domain';
import {
  i18n as appI18n,
  type I18n,
} from '../../../infrastructure/ui/i18n/i18n';
import type { FileSizePresenter } from '../documents/file-size.presenter';
import {
  EXPENSE_REPORT_CATEGORY_DISPLAY_ORDER,
  EXPENSE_REPORT_CATEGORY_ICONS,
  EXPENSE_REPORT_PROOF_ICONS,
} from './expense-report-display';

/** The values a form opens with, as its fields hold them. */
export interface ExpenseReportFormDefaults {
  date: string;
  category: string;
  paymentMethod: string;
  /** "68,00" */
  amount: string;
  /** The rate in percent, or '' without VAT. */
  vatRate: string;
  description: string;
  project: string;
  keepProof: boolean;
}

export interface ExpenseReportFormModel {
  title: string;
  intro: string;
  submitLabel: string;
  /** Icon of the submit button. */
  submitIcon: string;
  defaults: ExpenseReportFormDefaults;
  categories: { value: string; label: string; icon: string }[];
  paymentMethods: { value: string; label: string }[];
  /** Projects already used, offered while typing. */
  projectSuggestions: string[];
  /** `accept` attribute of the file input: extensions and media types. */
  accept: string;
  dropzoneHint: string;
  descriptionMaxLength: number;
  projectMaxLength: number;
  /** The receipt already attached to the report being changed. */
  currentProof: { name: string; details: string; icon: string } | null;
}

/** Presents the expense report form: a new report, or the change of one. */
export class ExpenseReportFormPresenter {
  constructor(
    private readonly sizes: FileSizePresenter,
    private readonly i18n: I18n = appI18n,
  ) {}

  /** `report` is the report being changed, null for a new one. */
  present(
    report: ExpenseReportSummary | null,
    projects: readonly ExpenseReportProjectCount[],
  ): ExpenseReportFormModel {
    const labels = this.i18n.messages.expenseReports;
    const form = labels.form;
    return {
      title: report === null ? form.createTitle : form.editTitle,
      intro: form.intro,
      submitLabel: report === null ? form.submit : form.save,
      submitIcon: report === null ? 'ri-send-plane-line' : 'ri-save-line',
      defaults: this.presentDefaults(report),
      categories: EXPENSE_REPORT_CATEGORY_DISPLAY_ORDER.map((category) => ({
        value: category,
        label: labels.categories[category],
        icon: EXPENSE_REPORT_CATEGORY_ICONS[category],
      })),
      paymentMethods: EXPENSE_REPORT_PAYMENT_METHODS.map((method) => ({
        value: method,
        label: labels.paymentMethods[method],
      })),
      projectSuggestions: projects.map(({ project }) => project),
      accept: [
        ...ACCEPTED_EXPENSE_REPORT_PROOF_EXTENSIONS.map((extension) => `.${extension}`),
        ...ACCEPTED_EXPENSE_REPORT_PROOF_MIME_TYPES,
      ].join(','),
      dropzoneHint: form.dropzoneHint,
      descriptionMaxLength: EXPENSE_REPORT_DESCRIPTION_MAX_LENGTH,
      projectMaxLength: EXPENSE_REPORT_PROJECT_MAX_LENGTH,
      currentProof:
        report?.proof == null
          ? null
          : {
              name: report.proof.fileName,
              details: form.proofAttached.replace('{size}', this.sizes.present(report.proof.sizeBytes)),
              icon: EXPENSE_REPORT_PROOF_ICONS[report.proof.format] ?? 'ri-file-line',
            },
    };
  }

  private presentDefaults(report: ExpenseReportSummary | null): ExpenseReportFormDefaults {
    if (report === null) {
      return {
        date: '',
        category: '',
        paymentMethod: ExpenseReportPaymentMethod.PERSONAL_CARD,
        amount: '',
        vatRate: '',
        description: '',
        project: '',
        keepProof: false,
      };
    }
    return {
      date: report.date,
      category: report.category,
      paymentMethod: report.paymentMethod,
      amount: report.amount.replace('.', ','),
      vatRate: report.vatRate === null ? '' : String(report.vatRate),
      description: report.description,
      project: report.project ?? '',
      keepProof: report.proof !== null,
    };
  }
}
