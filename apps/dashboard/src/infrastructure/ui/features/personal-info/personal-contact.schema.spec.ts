import { describe, expect, it } from 'vitest';
import { ErrorCode } from '@hexagonal-monorepo-template/domain';
import { personalContactSchema } from './personal-contact.schema';

const valid = { address: '14 rue des Tilleuls', postalCodeAndCity: '34000 Montpellier', phone: '06 12 34 56 47', email: 'camille.martin@mail.fr' };

function problemOf(values: typeof valid): string | undefined {
  const result = personalContactSchema.safeParse(values);
  return result.success ? undefined : result.error.issues[0]?.message;
}

describe('personalContactSchema', () => {
  it('accepts valid contact details, trimmed', () => {
    expect(personalContactSchema.parse({ ...valid, address: ' 8 avenue de Lodève ' }).address).toBe('8 avenue de Lodève');
  });

  it('requires every field', () => {
    expect(problemOf({ ...valid, phone: '  ' })).toBe(ErrorCode.REQUIRED_INFORMATION);
  });

  it.each([
    ['postalCodeAndCity', 'Montpellier'],
    ['phone', '12 34'],
    ['email', 'camille.martin'],
    ['address', 'a'.repeat(151)],
  ])('refuses the %s %s', (field, value) => {
    expect(problemOf({ ...valid, [field]: value })).toBe(ErrorCode.INVALID_INFORMATION);
  });
});
