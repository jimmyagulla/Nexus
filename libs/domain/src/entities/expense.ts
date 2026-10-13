import { ExpenseDetails } from './expense-details';

export class Expense {
  constructor(
    readonly id: string,
    readonly details: ExpenseDetails,
  ) {}
}
