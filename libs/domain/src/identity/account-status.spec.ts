import { isAccountStatus } from './account-status';

describe('isAccountStatus', () => {
  it('recognises every account status of the workspace', () => {
    expect(
      ['INVITED', 'ACTIVE', 'DISABLED'].filter(
        (status) => !isAccountStatus(status),
      ),
    ).toEqual([]);
  });

  it('refuses a status outside the workspace', () => {
    expect(isAccountStatus('PENDING')).toBe(false);
  });

  it('refuses a known status written in another case', () => {
    expect(isAccountStatus('invited')).toBe(false);
  });

  it('refuses an empty status', () => {
    expect(isAccountStatus('')).toBe(false);
  });

  it('refuses a property inherited from the object prototype', () => {
    expect(isAccountStatus('toString')).toBe(false);
  });
});
