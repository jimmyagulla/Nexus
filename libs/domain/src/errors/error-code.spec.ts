import { isErrorCode } from './error-code';

describe('isErrorCode', () => {
  it('recognises every business error code', () => {
    expect(isErrorCode('ACCESS_DENIED')).toBe(true);
    expect(isErrorCode('REQUIRED_INFORMATION')).toBe(true);
    expect(isErrorCode('POTENTIAL_DUPLICATE')).toBe(true);
    expect(isErrorCode('INVALID_AMOUNT')).toBe(true);
    expect(isErrorCode('INVALID_VAT')).toBe(true);
    expect(isErrorCode('INACTIVE_EMPLOYEE')).toBe(true);
    expect(isErrorCode('REQUEST_ALREADY_PROCESSED')).toBe(true);
    expect(isErrorCode('MISSING_DOCUMENT')).toBe(true);
    expect(isErrorCode('INVALID_FILE')).toBe(true);
    expect(isErrorCode('INVALID_PERIOD')).toBe(true);
  });

  it('refuses a code outside the business vocabulary', () => {
    expect(isErrorCode('SOMETHING_WENT_WRONG')).toBe(false);
  });

  it('refuses a known code written in another case', () => {
    expect(isErrorCode('access_denied')).toBe(false);
  });

  it('refuses an empty code', () => {
    expect(isErrorCode('')).toBe(false);
  });

  it('refuses a property inherited from the object prototype', () => {
    expect(isErrorCode('toString')).toBe(false);
    expect(isErrorCode('constructor')).toBe(false);
  });
});
