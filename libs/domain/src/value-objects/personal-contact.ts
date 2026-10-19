import { requireText, requireValid } from '../services/text-rules';
import {
  PERSONAL_ADDRESS_MAX_LENGTH,
  PERSONAL_EMAIL_MAX_LENGTH,
  PERSONAL_EMAIL_PATTERN,
  PERSONAL_PHONE_PATTERN,
  PERSONAL_POSTAL_CODE_AND_CITY_MAX_LENGTH,
  PERSONAL_POSTAL_CODE_AND_CITY_PATTERN,
} from './personal-contact-limits';

/** The contact details an employee keeps up to date themselves. */
export type PersonalContactValues = {
  address: string;
  postalCodeAndCity: string;
  phone: string;
  /** Personal e-mail address, not the professional one. */
  email: string;
};

/** The four contact details fields, in their display order. */
export const PERSONAL_CONTACT_FIELDS = [
  'address',
  'postalCodeAndCity',
  'phone',
  'email',
] as const satisfies readonly (keyof PersonalContactValues)[];

export type PersonalContactField = (typeof PERSONAL_CONTACT_FIELDS)[number];

/** Valid contact details: every field filled, trimmed, within its rule. */
export class PersonalContact {
  private constructor(private readonly values: PersonalContactValues) {}

  static parse(raw: PersonalContactValues): PersonalContact {
    const address = requireText(raw.address);
    const postalCodeAndCity = requireText(raw.postalCodeAndCity);
    const phone = requireText(raw.phone);
    const email = requireText(raw.email);

    return new PersonalContact({
      address: requireValid(address, address.length <= PERSONAL_ADDRESS_MAX_LENGTH),
      postalCodeAndCity: requireValid(
        postalCodeAndCity,
        postalCodeAndCity.length <= PERSONAL_POSTAL_CODE_AND_CITY_MAX_LENGTH &&
          PERSONAL_POSTAL_CODE_AND_CITY_PATTERN.test(postalCodeAndCity),
      ),
      phone: requireValid(phone, PERSONAL_PHONE_PATTERN.test(phone)),
      email: requireValid(
        email,
        email.length <= PERSONAL_EMAIL_MAX_LENGTH && PERSONAL_EMAIL_PATTERN.test(email),
      ),
    });
  }

  get address(): string {
    return this.values.address;
  }

  get postalCodeAndCity(): string {
    return this.values.postalCodeAndCity;
  }

  get phone(): string {
    return this.values.phone;
  }

  get email(): string {
    return this.values.email;
  }

  toValues(): PersonalContactValues {
    return { ...this.values };
  }
}

/** The fields whose value differs between two versions of the contact details. */
export function changedPersonalContactFields(
  previous: PersonalContactValues,
  next: PersonalContactValues,
): PersonalContactField[] {
  return PERSONAL_CONTACT_FIELDS.filter((field) => previous[field].trim() !== next[field].trim());
}
