import { z } from 'zod';
import {
  ErrorCode,
  PERSONAL_ADDRESS_MAX_LENGTH,
  PERSONAL_EMAIL_MAX_LENGTH,
  PERSONAL_EMAIL_PATTERN,
  PERSONAL_PHONE_PATTERN,
  PERSONAL_POSTAL_CODE_AND_CITY_MAX_LENGTH,
  PERSONAL_POSTAL_CODE_AND_CITY_PATTERN,
  type PersonalContactValues,
} from '@hexagonal-monorepo-template/domain';

const required = () => z.string().trim().min(1, ErrorCode.REQUIRED_INFORMATION);

/** The rules of `PersonalContact`, checked before anything is sent. */
export const personalContactSchema = z.object({
  address: required().max(PERSONAL_ADDRESS_MAX_LENGTH, ErrorCode.INVALID_INFORMATION),
  postalCodeAndCity: required()
    .max(PERSONAL_POSTAL_CODE_AND_CITY_MAX_LENGTH, ErrorCode.INVALID_INFORMATION)
    .regex(PERSONAL_POSTAL_CODE_AND_CITY_PATTERN, ErrorCode.INVALID_INFORMATION),
  phone: required().regex(PERSONAL_PHONE_PATTERN, ErrorCode.INVALID_INFORMATION),
  email: required()
    .max(PERSONAL_EMAIL_MAX_LENGTH, ErrorCode.INVALID_INFORMATION)
    .regex(PERSONAL_EMAIL_PATTERN, ErrorCode.INVALID_INFORMATION),
}) satisfies z.ZodType<PersonalContactValues>;

export type PersonalContactFormValues = z.infer<typeof personalContactSchema>;
