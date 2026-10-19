import { maskIban, maskSocialSecurityNumber } from './mask-sensitive-numbers';

describe('maskSocialSecurityNumber', () => {
  it('leaves the sex, the birth year and month and the key readable', () => {
    expect(maskSocialSecurityNumber('292057512345641')).toBe('2 92 05 •• ••• ••• 41');
  });

  it('reads a number written with spaces', () => {
    expect(maskSocialSecurityNumber('2 92 05 2A 123 456 41')).toBe('2 92 05 •• ••• ••• 41');
  });

  it('hides a number of another shape altogether', () => {
    expect(maskSocialSecurityNumber('12345')).toBe('•••••');
  });
});

describe('maskIban', () => {
  it('leaves the first group and the last digits readable', () => {
    expect(maskIban('FR7630006000011234567890189')).toBe('FR76 •••• •••• •••• •••• •••• 189');
  });

  it('reads an IBAN written by groups, in lower case', () => {
    expect(maskIban('fr76 3000 6000 0112 3456 7890 189')).toBe(
      'FR76 •••• •••• •••• •••• •••• 189',
    );
  });

  it('hides a too short value altogether', () => {
    expect(maskIban('FR76123')).toBe('•••• •••');
  });
});
