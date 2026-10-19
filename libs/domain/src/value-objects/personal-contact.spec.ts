import { ErrorCode } from '../errors/error-code';
import { changedPersonalContactFields, PersonalContact } from './personal-contact';

const valid = {
  address: '14 rue des Tilleuls',
  postalCodeAndCity: '34000 Montpellier',
  phone: '06 12 34 56 47',
  email: 'camille.martin@mail.fr',
};

describe('PersonalContact', () => {
  it('keeps the contact details, trimmed', () => {
    expect(
      PersonalContact.parse({ ...valid, address: '  8 avenue de Lodève  ' }).toValues(),
    ).toEqual({ ...valid, address: '8 avenue de Lodève' });
  });

  it.each(['address', 'postalCodeAndCity', 'phone', 'email'] as const)(
    'requires the %s',
    (field) => {
      expect(() => PersonalContact.parse({ ...valid, [field]: '   ' })).toThrow(
        ErrorCode.REQUIRED_INFORMATION,
      );
    },
  );

  it.each(['+33 6 12 34 56 47', '0612345647', '06.12.34.56.47', '04-67-00-00-00'])(
    'accepts the phone number %s',
    (phone) => {
      expect(PersonalContact.parse({ ...valid, phone }).phone).toBe(phone);
    },
  );

  it.each(['12 34', '00 12 34 56 47', '06 12 34 56 47 89', 'telephone'])(
    'refuses the phone number %s',
    (phone) => {
      expect(() => PersonalContact.parse({ ...valid, phone })).toThrow(
        ErrorCode.INVALID_INFORMATION,
      );
    },
  );

  it.each(['camille.martin', 'camille@mail', 'camille martin@mail.fr'])(
    'refuses the e-mail address %s',
    (email) => {
      expect(() => PersonalContact.parse({ ...valid, email })).toThrow(
        ErrorCode.INVALID_INFORMATION,
      );
    },
  );

  it.each(['Montpellier', '3400 Montpellier', '34000'])(
    'refuses the postal code and city %s',
    (postalCodeAndCity) => {
      expect(() => PersonalContact.parse({ ...valid, postalCodeAndCity })).toThrow(
        ErrorCode.INVALID_INFORMATION,
      );
    },
  );

  it('refuses an address longer than 150 characters', () => {
    expect(() => PersonalContact.parse({ ...valid, address: 'a'.repeat(151) })).toThrow(
      ErrorCode.INVALID_INFORMATION,
    );
  });
});

describe('changedPersonalContactFields', () => {
  it('names the changed fields, in their display order', () => {
    expect(
      changedPersonalContactFields(valid, {
        ...valid,
        email: 'camille@mail.fr',
        address: '8 avenue de Lodève',
      }),
    ).toEqual(['address', 'email']);
  });

  it('ignores spaces around a value', () => {
    expect(changedPersonalContactFields(valid, { ...valid, phone: ' 06 12 34 56 47 ' })).toEqual(
      [],
    );
  });
});
