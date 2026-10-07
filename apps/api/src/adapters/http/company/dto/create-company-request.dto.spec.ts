import { BadRequestException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { createValidationPipe } from '../../common/pipes/create-validation.pipe';
import { CreateCompanyRequestDto } from './create-company-request.dto';

function validate(payload: unknown): Promise<CreateCompanyRequestDto> {
  return createValidationPipe().transform(payload, {
    type: 'body',
    metatype: CreateCompanyRequestDto,
  });
}

describe('CreateCompanyRequestDto', () => {
  it('accepts a named company', async () => {
    await expect(validate({ name: 'Acme' })).resolves.toMatchObject({
      name: 'Acme',
    });
  });

  it('rejects a missing name', async () => {
    await expect(validate({})).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects an empty name', async () => {
    await expect(validate({ name: '' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('rejects a name that is not a string', async () => {
    await expect(validate({ name: 42 })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('rejects a payload carrying an unexpected property', async () => {
    await expect(
      validate({ name: 'Acme', id: 'company-1' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
