import { ExpenseAmountPresenter } from './expense-amount.presenter';

describe('ExpenseAmountPresenter', () => {
  const presenter = new ExpenseAmountPresenter();

  it('writes euros with a decimal comma and the unit after a no-break space', () => {
    expect(presenter.present('68.00')).toBe('68,00\u00a0€');
    expect(presenter.present('0.57')).toBe('0,57\u00a0€');
  });

  it('groups the thousands', () => {
    expect(presenter.present('1284.60')).toBe('1\u202f284,60\u00a0€');
    expect(presenter.present('99999.99')).toBe('99\u202f999,99\u00a0€');
  });
});
