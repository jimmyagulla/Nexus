import { describe, expect, it } from 'vitest';
import { ErrorCode } from '@hexagonal-monorepo-template/domain';
import { enrollmentCodeSchema } from './enrollment-code.schema';

describe('enrollmentCodeSchema', () => {
  it('accepts a code of six digits', () => {
    expect(enrollmentCodeSchema.safeParse({ code: '287082' }).success).toBe(
      true,
    );
  });

  it('trims the code', () => {
    expect(enrollmentCodeSchema.parse({ code: ' 287082 ' }).code).toBe(
      '287082',
    );
  });

  it('refuses an empty code with the required information message', () => {
    const result = enrollmentCodeSchema.safeParse({ code: '' });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });

  it('refuses a code that is not made of six digits', () => {
    expect(enrollmentCodeSchema.safeParse({ code: '28708' }).success).toBe(
      false,
    );
    expect(enrollmentCodeSchema.safeParse({ code: '28708a' }).success).toBe(
      false,
    );
  });
});
