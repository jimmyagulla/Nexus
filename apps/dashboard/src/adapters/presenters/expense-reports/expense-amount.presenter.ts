import { ExpenseAmount } from '@hexagonal-monorepo-template/domain';

/** "1 284,60 €" */
export type ExpenseAmountLabel = string;

/** Narrow no-break space between thousands, no-break space before the unit. */
const THOUSANDS = '\u202f';
const UNIT = '\u00a0€';

/** Presents an amount in euros, for the rows, the key figures, the filters and the detail. */
export class ExpenseAmountPresenter {
  /** `amount` as the API keeps it ("1284.60"); text that is not an amount is shown as is. */
  present(amount: string): ExpenseAmountLabel {
    const parsed = ExpenseAmount.read(amount);
    if (parsed === null) {
      return amount;
    }
    const units = String(Math.floor(parsed.cents / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, THOUSANDS);
    const cents = String(parsed.cents % 100).padStart(2, '0');
    return `${units},${cents}${UNIT}`;
  }
}
