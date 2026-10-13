import { describe, expect, it } from 'vitest';
import { ErrorCode } from '@hexagonal-monorepo-template/domain';
import { expenseCategorySchema } from './expense-category.schema';

describe('expenseCategorySchema', () => {
  it('drops the spaces surrounding the label', () => {
    expect(expenseCategorySchema.parse({ label: ' Hôtel ' })).toEqual({
      label: 'Hôtel',
    });
  });

  it('refuses a label made of spaces', () => {
    const result = expenseCategorySchema.safeParse({ label: '  ' });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(ErrorCode.REQUIRED_INFORMATION);
  });
});
