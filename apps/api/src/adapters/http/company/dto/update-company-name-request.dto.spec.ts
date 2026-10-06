import { BadRequestException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { createValidationPipe } from '../../common/pipes/create-validation.pipe';
import { UpdateCompanyNameRequestDto } from './update-company-name-request.dto';

function validate(payload: unknown): Promise<UpdateCompanyNameRequestDto> {
  return createValidationPipe().transform(payload, {
    type: 'body',
    metatype: UpdateCompanyNameRequestDto,
  });
}

describe('UpdateCompanyNameRequestDto', () => {
  it('accepts a new name', async () => {
    await expect(validate({ name: 'Acme Europe' })).resolves.toMatchObject({
      name: 'Acme Europe',
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
    await expect(validate({ name: ['Acme'] })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('rejects a payload carrying an unexpected property', async () => {
    await expect(
      validate({ name: 'Acme', companyId: 'company-1' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
