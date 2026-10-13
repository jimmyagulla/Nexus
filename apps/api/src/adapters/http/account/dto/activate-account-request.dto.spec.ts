import { BadRequestException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { createValidationPipe } from '../../common/pipes/create-validation.pipe';
import { ActivateAccountRequestDto } from './activate-account-request.dto';

function validate(payload: unknown): Promise<ActivateAccountRequestDto> {
  return createValidationPipe().transform(payload, {
    type: 'body',
    metatype: ActivateAccountRequestDto,
  });
}

describe('ActivateAccountRequestDto', () => {
  it('accepts an invitation and a secret', async () => {
    await expect(
      validate({ invitationToken: 'invite-1', secret: 's3cret' }),
    ).resolves.toMatchObject({
      invitationToken: 'invite-1',
      secret: 's3cret',
    });
  });

  it('rejects a missing invitation', async () => {
    await expect(validate({ secret: 's3cret' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('rejects a missing secret', async () => {
    await expect(
      validate({ invitationToken: 'invite-1' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects an empty secret', async () => {
    await expect(
      validate({ invitationToken: 'invite-1', secret: '' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
