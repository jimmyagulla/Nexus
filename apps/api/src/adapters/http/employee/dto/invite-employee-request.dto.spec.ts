import { BadRequestException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { createValidationPipe } from '../../common/pipes/create-validation.pipe';
import { InviteEmployeeRequestDto } from './invite-employee-request.dto';

function validate(payload: unknown): Promise<InviteEmployeeRequestDto> {
  return createValidationPipe().transform(payload, {
    type: 'body',
    metatype: InviteEmployeeRequestDto,
  });
}

describe('InviteEmployeeRequestDto', () => {
  it('accepts the identifier the employee will sign in with', async () => {
    await expect(validate({ identifier: 'alice' })).resolves.toMatchObject({
      identifier: 'alice',
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
    await expect(validate({ identifier: ['alice'] })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('rejects a payload carrying an unexpected property', async () => {
    await expect(
      validate({ identifier: 'alice', employeeId: 'e1' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
