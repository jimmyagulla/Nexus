import { ErrorCode } from '../errors/error-code';
import { ExpenseAmount, sumOfExpenseAmounts } from './expense-amount';

describe('ExpenseAmount', () => {
  it('reads a comma or a dot as the decimal separator', () => {
    expect(ExpenseAmount.parse('68,5').value).toBe('68.50');
    expect(ExpenseAmount.parse('68.05').value).toBe('68.05');
    expect(ExpenseAmount.parse(' 112 ').value).toBe('112.00');
  });

  it('keeps whole cents', () => {
    expect(ExpenseAmount.parse('0,10').cents).toBe(10);
    expect(ExpenseAmount.parse('1284,60').cents).toBe(128_460);
  });

  it('requires an amount', () => {
    expect(() => ExpenseAmount.parse('  ')).toThrow(ErrorCode.REQUIRED_INFORMATION);
  });

  it('refuses a zero, a negative or a malformed amount', () => {
    expect(() => ExpenseAmount.parse('0')).toThrow(ErrorCode.INVALID_INFORMATION);
    expect(() => ExpenseAmount.parse('-12')).toThrow(ErrorCode.INVALID_INFORMATION);
    expect(() => ExpenseAmount.parse('12,345')).toThrow(ErrorCode.INVALID_INFORMATION);
    expect(() => ExpenseAmount.parse('12 €')).toThrow(ErrorCode.INVALID_INFORMATION);
    expect(() => ExpenseAmount.parse('1e3')).toThrow(ErrorCode.INVALID_INFORMATION);
  });

  it('refuses an amount above 99 999,99 €', () => {
    expect(ExpenseAmount.parse('99999,99').value).toBe('99999.99');
    expect(() => ExpenseAmount.parse('100000')).toThrow(ErrorCode.INVALID_INFORMATION);
  });

  it('reads nothing from a text that is not an amount', () => {
    expect(ExpenseAmount.read('abc')).toBeNull();
    expect(ExpenseAmount.read('0')?.value).toBe('0.00');
  });

  it('computes the VAT included in the amount, to the nearest cent', () => {
    expect(ExpenseAmount.parse('68').vatAt(10).value).toBe('6.18');
    expect(ExpenseAmount.parse('45').vatAt(20).value).toBe('7.50');
    expect(ExpenseAmount.parse('12').vatAt(5).value).toBe('0.57');
  });

  it('sums amounts', () => {
    expect(sumOfExpenseAmounts([ExpenseAmount.parse('112'), ExpenseAmount.parse('42,50')]).value).toBe('154.50');
    expect(sumOfExpenseAmounts([]).value).toBe('0.00');
  });
});
