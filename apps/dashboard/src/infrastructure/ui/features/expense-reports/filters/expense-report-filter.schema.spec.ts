import { describe, expect, it } from 'vitest';
import { ErrorCode } from '@hexagonal-monorepo-template/domain';
import {
  expenseReportFilterSchema,
  type ExpenseReportFilterFormValues,
} from './expense-report-filter.schema';

const empty: ExpenseReportFilterFormValues = {
  employeeId: '',
  status: '',
  from: '',
  to: '',
  minAmount: '',
  maxAmount: '',
};

function messagesFor(values: ExpenseReportFilterFormValues): string[] {
  const result = expenseReportFilterSchema.safeParse(values);
  return result.success ? [] : result.error.issues.map((issue) => issue.message);
}

describe('expenseReportFilterSchema', () => {
  it('turns an empty form into a filter without criterion', () => {
    expect(expenseReportFilterSchema.parse(empty)).toEqual({});
  });

  it('turns every field into its criterion', () => {
    expect(
      expenseReportFilterSchema.parse({
        employeeId: ' e1 ',
        status: 'SUBMITTED',
        from: '2026-10-01',
        to: '2026-10-31',
        minAmount: '10,5',
        maxAmount: '500',
      }),
    ).toEqual({
      employeeId: 'e1',
      status: 'SUBMITTED',
      from: '2026-10-01',
      to: '2026-10-31',
      minAmount: 10.5,
      maxAmount: 500,
    });
  });

  it('leaves the blank fields out of the filter', () => {
    expect(
      expenseReportFilterSchema.parse({ ...empty, status: 'DRAFT' }),
    ).toEqual({ status: 'DRAFT' });
  });

  it('refuses a period that ends before it starts', () => {
    expect(
      messagesFor({ ...empty, from: '2026-10-31', to: '2026-10-01' }),
    ).toEqual([ErrorCode.INVALID_PERIOD]);
  });

  it('accepts a period of one day', () => {
    expect(
      messagesFor({ ...empty, from: '2026-10-05', to: '2026-10-05' }),
    ).toEqual([]);
  });

  it('refuses an amount that is not a number', () => {
    expect(messagesFor({ ...empty, minAmount: 'beaucoup' })).toEqual([
      ErrorCode.INVALID_AMOUNT,
    ]);
  });

  it('refuses a negative amount', () => {
    expect(messagesFor({ ...empty, maxAmount: '-3' })).toEqual([
      ErrorCode.INVALID_AMOUNT,
    ]);
  });

  it('refuses a malformed date', () => {
    expect(messagesFor({ ...empty, from: '05/10/2026' })).toEqual([
      ErrorCode.REQUIRED_INFORMATION,
    ]);
  });
});
