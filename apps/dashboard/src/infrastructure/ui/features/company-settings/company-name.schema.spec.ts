import { describe, expect, it } from 'vitest';
import { ErrorCode } from '@hexagonal-monorepo-template/domain';
import { companyNameSchema } from './company-name.schema';

describe('companyNameSchema', () => {
  it('rejects a blank name', () => {
    const result = companyNameSchema.safeParse({ name: '  ' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        ErrorCode.REQUIRED_INFORMATION,
      );
    }
  });
});
