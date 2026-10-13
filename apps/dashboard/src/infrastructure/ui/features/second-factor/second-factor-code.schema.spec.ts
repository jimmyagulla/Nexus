import { describe, expect, it } from 'vitest';
import { ErrorCode } from '@hexagonal-monorepo-template/domain';
import { secondFactorCodeSchema } from './second-factor-code.schema';

function messageOf(code: unknown): string | undefined {
  const result = secondFactorCodeSchema.safeParse({ code });
  return result.success ? undefined : result.error.issues[0]?.message;
}

describe('secondFactorCodeSchema', () => {
  it('accepts a six digit code', () => {
    expect(secondFactorCodeSchema.safeParse({ code: '123456' }).success).toBe(
      true,
    );
  });

  it('accepts a code written in two halves', () => {
    expect(secondFactorCodeSchema.safeParse({ code: '123 456' }).success).toBe(
      true,
    );
  });

  it('asks for the information when the code is empty', () => {
    expect(messageOf('')).toBe(ErrorCode.REQUIRED_INFORMATION);
    expect(messageOf('   ')).toBe(ErrorCode.REQUIRED_INFORMATION);
  });

  it('requires the second factor when the code is not six digits', () => {
    expect(messageOf('12345')).toBe(ErrorCode.SECOND_FACTOR_REQUIRED);
    expect(messageOf('12345a')).toBe(ErrorCode.SECOND_FACTOR_REQUIRED);
  });

  it('rejects a code that is not a string', () => {
    expect(secondFactorCodeSchema.safeParse({ code: 123456 }).success).toBe(
      false,
    );
  });
});
