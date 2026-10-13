import { UserRole } from '../identity/user-role';

export function requiresSecondFactor(role: UserRole | null): boolean {
  return role === UserRole.EMPLOYEE;
}
