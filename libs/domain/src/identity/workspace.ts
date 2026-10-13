import { UserRole } from './user-role';

export const Workspace = {
  COMPANY: 'COMPANY',
  EMPLOYEE: 'EMPLOYEE',
  ACCOUNTANT: 'ACCOUNTANT',
} as const;

export type Workspace = (typeof Workspace)[keyof typeof Workspace];

export function workspaceFor(role: UserRole): Workspace {
  switch (role) {
    case UserRole.EMPLOYER:
      return Workspace.COMPANY;
    case UserRole.EMPLOYEE:
      return Workspace.EMPLOYEE;
    case UserRole.ACCOUNTANT:
      return Workspace.ACCOUNTANT;
  }
}
