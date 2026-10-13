import { describe, expect, it } from 'vitest';
import { ErrorCode } from '@hexagonal-monorepo-template/domain';
import { secondFactorProofSchema } from './second-factor-proof.schema';

function messageOf(code: unknown): string | undefined {
  const result = secondFactorProofSchema.safeParse({ code });
  return result.success ? undefined : result.error.issues[0]?.message;
}

describe('secondFactorProofSchema', () => {
  it('accepts the usual six digit code', () => {
    expect(secondFactorProofSchema.safeParse({ code: '123456' }).success).toBe(
      true,
    );
  });

  it('accepts a recovery code with its dash', () => {
    expect(
      secondFactorProofSchema.safeParse({ code: 'ABCDE-23456' }).success,
    ).toBe(true);
  });

  it('accepts a recovery code typed in lower case', () => {
    expect(
      secondFactorProofSchema.safeParse({ code: 'abcde23456' }).success,
    ).toBe(true);
  });

  it('asks for the information when nothing is typed', () => {
    expect(messageOf('')).toBe(ErrorCode.REQUIRED_INFORMATION);
  });

  it('requires the second factor for anything else', () => {
    expect(messageOf('12345')).toBe(ErrorCode.SECOND_FACTOR_REQUIRED);
    expect(messageOf('hello')).toBe(ErrorCode.SECOND_FACTOR_REQUIRED);
  });
});
