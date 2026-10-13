import { BadRequestException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { createValidationPipe } from '../../common/pipes/create-validation.pipe';
import { ConfirmSecondFactorEnrollmentRequestDto } from './confirm-second-factor-enrollment-request.dto';

function validate(
  payload: unknown,
): Promise<ConfirmSecondFactorEnrollmentRequestDto> {
  return createValidationPipe().transform(payload, {
    type: 'body',
    metatype: ConfirmSecondFactorEnrollmentRequestDto,
  });
}

describe('ConfirmSecondFactorEnrollmentRequestDto', () => {
  it('accepts an enrollment and a code', async () => {
    await expect(
      validate({ enrollmentId: 'enrollment-1', code: '287082' }),
    ).resolves.toMatchObject({ enrollmentId: 'enrollment-1', code: '287082' });
  });

  it('rejects a missing enrollment', async () => {
    await expect(validate({ code: '287082' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('rejects a missing code', async () => {
    await expect(
      validate({ enrollmentId: 'enrollment-1' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects an empty code', async () => {
    await expect(
      validate({ enrollmentId: 'enrollment-1', code: '' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects a code that is not a string', async () => {
    await expect(
      validate({ enrollmentId: 'enrollment-1', code: 287082 }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects a payload carrying an unexpected property', async () => {
    await expect(
      validate({ enrollmentId: 'enrollment-1', code: '287082', role: 'EMPLOYER' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
