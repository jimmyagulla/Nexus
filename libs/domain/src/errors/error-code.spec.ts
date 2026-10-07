import { isErrorCode } from './error-code';

describe('isErrorCode', () => {
  it('recognises every business error code', () => {
    expect(isErrorCode('ACCESS_DENIED')).toBe(true);
    expect(isErrorCode('REQUIRED_INFORMATION')).toBe(true);
    expect(isErrorCode('POTENTIAL_DUPLICATE')).toBe(true);
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
