import { ErrorCode } from '../errors/error-code';
import { isUserRole, parseUserRole, UserRole } from './user-role';

describe('parseUserRole', () => {
  it('reads each role of the workspace', () => {
    expect(parseUserRole('EMPLOYER')).toBe(UserRole.EMPLOYER);
    expect(parseUserRole('EMPLOYEE')).toBe(UserRole.EMPLOYEE);
    expect(parseUserRole('ACCOUNTANT')).toBe(UserRole.ACCOUNTANT);
  });

  it('refuses a role outside the workspace', () => {
    expect(() => parseUserRole('ADMIN')).toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses a known role written in another case', () => {
    expect(() => parseUserRole('employer')).toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses an empty role', () => {
    expect(() => parseUserRole('')).toThrow(ErrorCode.ACCESS_DENIED);
  });
});

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
