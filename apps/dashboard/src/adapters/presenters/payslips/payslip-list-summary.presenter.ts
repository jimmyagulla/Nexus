import { PayslipList } from '@hexagonal-monorepo-template/domain';
import {
  i18n as appI18n,
  type I18n,
} from '../../../infrastructure/ui/i18n/i18n';
import type { CountLabelPresenter } from '../documents/count-label.presenter';

export interface PayslipListSummaryModel {
  /** "67 bulletins conservés dans votre coffre jusqu'à vos 75 ans." */
  summary: string;
  /** Shown instead of rows when the year has none. */
  emptyMessage: string;
}

/** Presents what the payslips list says about the whole vault. */
export class PayslipListSummaryPresenter {
  constructor(
    private readonly counts: CountLabelPresenter,
    private readonly i18n: I18n = appI18n,
  ) {}

  present(list: PayslipList): PayslipListSummaryModel {
    const labels = this.i18n.messages.payslips.list;
    return {
      summary: this.counts.present(list.total, labels.summary),
      emptyMessage: labels.empty,
    };
  }
}
