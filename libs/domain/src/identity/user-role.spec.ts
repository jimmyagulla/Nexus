import { isUserRole } from './user-role';

describe('isUserRole', () => {
  it('recognises every role of the workspace', () => {
    expect(
      ['EMPLOYER', 'EMPLOYEE', 'ACCOUNTANT'].filter((role) => !isUserRole(role)),
    ).toEqual([]);
  });

  it('refuses a role outside the workspace', () => {
    expect(isUserRole('ADMIN')).toBe(false);
  });

  it('refuses a known role written in another case', () => {
    expect(isUserRole('employer')).toBe(false);
  });

  it('refuses an empty role', () => {
    expect(isUserRole('')).toBe(false);
  });

  it('refuses a property inherited from the object prototype', () => {
    expect(isUserRole('toString')).toBe(false);
  });
});
