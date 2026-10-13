import { describe, expect, it } from 'vitest';
import { ErrorCode } from '@hexagonal-monorepo-template/domain';
import { createExpenseReportSchema } from './create-expense-report.schema';

describe('createExpenseReportSchema', () => {
  it('keeps a label', () => {
    expect(createExpenseReportSchema.parse({ label: 'Lyon' })).toEqual({
      label: 'Lyon',
    });
  });

  it('drops the spaces surrounding the label', () => {
    expect(createExpenseReportSchema.parse({ label: '  Lyon ' }).label).toBe(
      'Lyon',
    );
  });

  it('refuses a label made of spaces', () => {
    const result = createExpenseReportSchema.safeParse({ label: '   ' });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(ErrorCode.REQUIRED_INFORMATION);
  });
});
