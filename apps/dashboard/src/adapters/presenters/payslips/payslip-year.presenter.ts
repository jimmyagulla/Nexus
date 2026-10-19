import {
  adjacentPayslipYears,
  PayslipList,
} from '@hexagonal-monorepo-template/domain';
import {
  i18n as appI18n,
  type I18n,
} from '../../../infrastructure/ui/i18n/i18n';
import type { CountLabelPresenter } from '../documents/count-label.presenter';

export interface PayslipYearOptionModel {
  year: number;
  label: string;
  selected: boolean;
}

export interface PayslipYearModel {
  /** The year shown, e.g. "2026". */
  year: string;
  /** "9 bulletins en 2026" */
  yearSummary: string;
  /** The years with a payslip right before and after; null at either end. */
  previousYear: number | null;
  nextYear: number | null;
  /** Years offered by the year menu, the most recent first. */
  options: PayslipYearOptionModel[];
  /** "Tout télécharger (2026)" */
  downloadAllLabel: string;
  canDownloadAll: boolean;
}

/** Presents the year picker of the payslips list and what it says about that year. */
export class PayslipYearPresenter {
  constructor(
    private readonly counts: CountLabelPresenter,
    private readonly i18n: I18n = appI18n,
  ) {}

  /** `year` is the one the list was asked for. */
  present(list: PayslipList, year: number): PayslipYearModel {
    const labels = this.i18n.messages.payslips.list;
    const label = String(year);
    const { previous, next } = adjacentPayslipYears(list.years, year);
    return {
      year: label,
      yearSummary: this.counts.present(list.items.length, labels.yearSummary).replace('{year}', label),
      previousYear: previous,
      nextYear: next,
      options: this.presentOptions(list.years, year),
      downloadAllLabel: labels.downloadAllOf.replace('{label}', labels.downloadAll).replace('{year}', label),
      canDownloadAll: list.items.length > 0,
    };
  }

  /** The years with a payslip, and the one shown even without any. */
  private presentOptions(years: readonly number[], year: number): PayslipYearOptionModel[] {
    return [...new Set([...years, year])]
      .sort((left, right) => right - left)
      .map((option) => ({ year: option, label: String(option), selected: option === year }));
  }
}
