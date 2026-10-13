import { describe, expect, it } from 'vitest';
import { ErrorCode } from '@hexagonal-monorepo-template/domain';
import { inviteEmployerSchema } from './invite-employer.schema';

describe('inviteEmployerSchema', () => {
  it('accepts an identifier', () => {
    expect(inviteEmployerSchema.parse({ identifier: 'colleague' })).toEqual({
      identifier: 'colleague',
    });
  });

  it('trims the identifier', () => {
    expect(inviteEmployerSchema.parse({ identifier: '  colleague ' })).toEqual({
      identifier: 'colleague',
    });
  });

  it('refuses a blank identifier with the required information message', () => {
    const result = inviteEmployerSchema.safeParse({ identifier: '   ' });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });
});
