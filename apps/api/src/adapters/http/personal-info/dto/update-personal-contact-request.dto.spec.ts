import { BadRequestException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { createValidationPipe } from '../../common/pipes/create-validation.pipe';
import { UpdatePersonalContactRequestDto } from './update-personal-contact-request.dto';

const valid = { address: '14 rue des Tilleuls', postalCodeAndCity: '34000 Montpellier', phone: '06 12 34 56 47', email: 'camille.martin@mail.fr' };

function validate(payload: unknown): Promise<UpdatePersonalContactRequestDto> {
  return createValidationPipe().transform(payload, { type: 'body', metatype: UpdatePersonalContactRequestDto });
}

describe('UpdatePersonalContactRequestDto', () => {
  it('accepts the four contact details', async () => {
    await expect(validate(valid)).resolves.toMatchObject(valid);
  });

  it.each(['address', 'postalCodeAndCity', 'phone', 'email'])('rejects a missing %s', async (field) => {
    await expect(validate({ ...valid, [field]: undefined })).rejects.toBeInstanceOf(BadRequestException);
  });

  it.each([
    ['postalCodeAndCity', 'Montpellier'],
    ['phone', '12 34'],
    ['email', 'camille.martin'],
    ['address', 'a'.repeat(151)],
  ])('rejects the %s %s', async (field, value) => {
    await expect(validate({ ...valid, [field]: value })).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects a field managed by the employer', async () => {
    await expect(validate({ ...valid, iban: 'FR7630006000011234567890189' })).rejects.toBeInstanceOf(BadRequestException);
  });
});
