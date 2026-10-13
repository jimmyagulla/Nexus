import {
  Account,
  AccountIdentifier,
  AccountStatus,
  UserRole,
} from '@hexagonal-monorepo-template/domain';

export type PrismaAccountRow = {
  id: string;
  companyId: string;
  identifier: string;
  role: UserRole;
  status: AccountStatus;
};

export function toAccount(row: PrismaAccountRow): Account {
  return new Account(
    row.id,
    row.companyId,
    AccountIdentifier.parse(row.identifier),
    row.role,
    row.status,
  );
}
