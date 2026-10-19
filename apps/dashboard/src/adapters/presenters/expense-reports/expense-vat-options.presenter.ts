import {
  EXPENSE_VAT_RATES,
  ExpenseAmount,
} from '@hexagonal-monorepo-template/domain';
import {
  i18n as appI18n,
  type I18n,
} from '../../../infrastructure/ui/i18n/i18n';
import type { ExpenseAmountPresenter } from './expense-amount.presenter';

/** Value of the VAT choice that means no VAT. */
export const NO_VAT = 'none';

export interface ExpenseVatOptionModel {
  value: string;
  /** "10 % · 6,18 €" once an amount is typed, "10 %" before. */
  label: string;
}

/** Presents the VAT choices of the form, with the VAT each rate comes to. */
export class ExpenseVatOptionsPresenter {
  constructor(
    private readonly amounts: ExpenseAmountPresenter,
    private readonly i18n: I18n = appI18n,
  ) {}

  /** `amount` is the amount including VAT as typed. */
  present(amount: string): ExpenseVatOptionModel[] {
    const vat = this.i18n.messages.expenseReports.vat;
    const typed = ExpenseAmount.read(amount);
    return [
      { value: NO_VAT, label: vat.none },
      ...EXPENSE_VAT_RATES.map((rate) => ({
        value: String(rate),
        label:
          typed === null || typed.cents === 0
            ? vat.rate.replace('{rate}', String(rate))
            : vat.rateWithAmount
                .replace('{rate}', String(rate))
                .replace('{amount}', this.amounts.present(typed.vatAt(rate).value)),
      })),
    ];
  }
}
