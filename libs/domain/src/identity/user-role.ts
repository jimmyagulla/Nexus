import { ErrorCode } from '../errors/error-code';

export const UserRole = {
  EMPLOYER: 'EMPLOYER',
  EMPLOYEE: 'EMPLOYEE',
  ACCOUNTANT: 'ACCOUNTANT',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

const VALUES = new Set<string>(Object.values(UserRole));

export function isUserRole(value: string): value is UserRole {
  return VALUES.has(value);
}

export function parseUserRole(value: string): UserRole {
  if (!isUserRole(value)) {
    throw new Error(ErrorCode.ACCESS_DENIED);
  }
  return value;
}
