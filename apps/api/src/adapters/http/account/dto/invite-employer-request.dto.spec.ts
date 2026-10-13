import { BadRequestException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { createValidationPipe } from '../../common/pipes/create-validation.pipe';
import { InviteEmployerRequestDto } from './invite-employer-request.dto';

function validate(payload: unknown): Promise<InviteEmployerRequestDto> {
  return createValidationPipe().transform(payload, {
    type: 'body',
    metatype: InviteEmployerRequestDto,
  });
}

describe('InviteEmployerRequestDto', () => {
  it('accepts an identifier', async () => {
    await expect(validate({ identifier: 'colleague' })).resolves.toMatchObject({
      identifier: 'colleague',
    });
  });

  it('rejects a missing identifier', async () => {
    await expect(validate({})).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects an empty identifier', async () => {
    await expect(validate({ identifier: '' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('rejects an identifier that is not a string', async () => {
    await expect(validate({ identifier: 42 })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('rejects a payload carrying a role', async () => {
    await expect(
      validate({ identifier: 'colleague', role: 'EMPLOYEE' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
