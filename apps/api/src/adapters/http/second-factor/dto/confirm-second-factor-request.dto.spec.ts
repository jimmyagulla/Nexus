import { BadRequestException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { createValidationPipe } from '../../common/pipes/create-validation.pipe';
import { ConfirmSecondFactorRequestDto } from './confirm-second-factor-request.dto';

function validate(payload: unknown): Promise<ConfirmSecondFactorRequestDto> {
  return createValidationPipe().transform(payload, {
    type: 'body',
    metatype: ConfirmSecondFactorRequestDto,
  });
}

describe('ConfirmSecondFactorRequestDto', () => {
  it('accepts a code', async () => {
    await expect(validate({ code: '123456' })).resolves.toMatchObject({
      code: '123456',
    });
  });

  it('rejects a missing code', async () => {
    await expect(validate({})).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects a code that is not a string', async () => {
    await expect(validate({ code: 123456 })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('rejects a payload carrying an unexpected property', async () => {
    await expect(
      validate({ code: '123456', userId: 'u2' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
