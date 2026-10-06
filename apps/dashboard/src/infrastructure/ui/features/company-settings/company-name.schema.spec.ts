import { describe, expect, it } from 'vitest';
import { ErrorMessage } from '@hexagonal-monorepo-template/domain';
import { companyNameSchema } from './company-name.schema';

describe('companyNameSchema', () => {
  it('accepts a trimmed company name', () => {
    expect(companyNameSchema.parse({ name: '  Acme  ' })).toEqual({
      name: 'Acme',
    });
  });

  it('rejects an empty company name with the domain message', () => {
    const parsed = companyNameSchema.safeParse({ name: '   ' });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.message).toBe(
        ErrorMessage.INFORMATION_OBLIGATOIRE,
      );
    }
  });
});
