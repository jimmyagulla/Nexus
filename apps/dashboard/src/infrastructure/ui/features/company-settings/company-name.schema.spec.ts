import { describe, expect, it } from 'vitest';
import { ErrorCode } from '@hexagonal-monorepo-template/domain';
import { companyNameSchema } from './company-name.schema';

describe('companyNameSchema', () => {
  it('accepts a filled name', () => {
    const result = companyNameSchema.safeParse({ name: 'Acme' });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('Acme');
    }
  });

  it('drops the spaces surrounding the name', () => {
    const result = companyNameSchema.safeParse({ name: '  Acme  ' });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('Acme');
    }
  });

  it('accepts a single character name', () => {
    expect(companyNameSchema.safeParse({ name: 'A' }).success).toBe(true);
  });

  it('rejects an empty name', () => {
    const result = companyNameSchema.safeParse({ name: '' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        ErrorCode.REQUIRED_INFORMATION,
      );
    }
  });

  it('rejects a missing name', () => {
    expect(companyNameSchema.safeParse({}).success).toBe(false);
  });

  it('rejects a name that is not a string', () => {
    expect(companyNameSchema.safeParse({ name: 42 }).success).toBe(false);
  });

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
