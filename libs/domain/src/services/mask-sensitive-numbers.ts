const HIDDEN = '•';

function hide(group: string): string {
  return HIDDEN.repeat(group.length);
}

/**
 * A French social security number with only its sex, birth year and month and
 * its key left readable: `2 92 05 •• ••• ••• 41`. A value of another shape is
 * hidden altogether.
 */
export function maskSocialSecurityNumber(raw: string): string {
  const digits = raw.replace(/\s/g, '');
  const groups = /^(\d)(\d{2})(\d{2})(\w{2})(\d{3})(\d{3})(\d{2})$/.exec(digits);
  if (groups === null) {
    return hide(digits);
  }
  const [, sex, year, month, department, city, rank, key] = groups;
  return [sex, year, month, hide(department), hide(city), hide(rank), key].join(' ');
}

/**
 * An IBAN by groups of four, with only its first group and its last digits
 * left readable: `FR76 •••• •••• •••• •••• •••• 189`.
 */
export function maskIban(raw: string): string {
  const groups = raw.replace(/\s/g, '').toUpperCase().match(/.{1,4}/g) ?? [];
  if (groups.length < 3) {
    return groups.map(hide).join(' ');
  }
  return groups
    .map((group, index) => (index === 0 || index === groups.length - 1 ? group : hide(group)))
    .join(' ');
}
