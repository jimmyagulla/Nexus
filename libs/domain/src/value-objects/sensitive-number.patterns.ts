/**
 * A French social security number without spaces, by its parts: sex, birth
 * year, birth month, department (`2A`/`2B` in Corsica), city, rank, key.
 */
export const SOCIAL_SECURITY_NUMBER_PARTS_PATTERN =
  /^(\d)(\d{2})(\d{2})(\w{2})(\d{3})(\d{3})(\d{2})$/;

/** The groups of four characters an IBAN is written in. */
export const IBAN_GROUP_PATTERN = /.{1,4}/g;

/** Spaces a number may be written with. */
export const SPACES_PATTERN = /\s/g;
