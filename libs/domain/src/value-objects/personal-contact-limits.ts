/** Longest postal address of an employee, in characters. */
export const PERSONAL_ADDRESS_MAX_LENGTH = 150;

/** Longest "postal code and city" line, in characters. */
export const PERSONAL_POSTAL_CODE_AND_CITY_MAX_LENGTH = 100;

/** Longest personal e-mail address, in characters (RFC 5321). */
export const PERSONAL_EMAIL_MAX_LENGTH = 254;

/** A French postal code (five digits), a space, then the city: `34000 Montpellier`. */
export const PERSONAL_POSTAL_CODE_AND_CITY_PATTERN = /^\d{5}\s+\S.*$/;

/**
 * A French phone number, national (`06 12 34 56 47`) or international
 * (`+33 6 12 34 56 47`); pairs may be separated by a space, a dot or a dash.
 */
export const PERSONAL_PHONE_PATTERN = /^(?:\+33\s?[1-9]|0[1-9])(?:[\s.-]?\d{2}){4}$/;

/** One `@`, a dotted domain, no space. */
export const PERSONAL_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
