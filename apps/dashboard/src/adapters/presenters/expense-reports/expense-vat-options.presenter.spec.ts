import { ExpenseAmountPresenter } from './expense-amount.presenter';
import { ExpenseVatOptionsPresenter } from './expense-vat-options.presenter';

describe('ExpenseVatOptionsPresenter', () => {
  const presenter = new ExpenseVatOptionsPresenter(new ExpenseAmountPresenter());

  it('offers no VAT and each rate, with the VAT it comes to', () => {
    expect(presenter.present('68,00')).toEqual([
      { value: 'none', label: 'Aucune' },
      { value: '5', label: '5 % · 3,24\u00a0€' },
      { value: '10', label: '10 % · 6,18\u00a0€' },
      { value: '20', label: '20 % · 11,33\u00a0€' },
    ]);
  });

  it('offers the rates alone until an amount is typed', () => {
    expect(presenter.present('').map((option) => option.label)).toEqual(['Aucune', '5 %', '10 %', '20 %']);
  });
});
