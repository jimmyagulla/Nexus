import { UserRole } from '@hexagonal-monorepo-template/domain';

export interface IGetCurrentRoleFromSession {
  execute(): Promise<UserRole | null>;
}

export const IGetCurrentRoleFromSession = Symbol(
  'IGetCurrentRoleFromSession',
);
