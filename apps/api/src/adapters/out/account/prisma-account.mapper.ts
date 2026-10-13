import {
  Account,
  AccountIdentifier,
  AccountStatus,
  parseUserRole,
} from '@hexagonal-monorepo-template/domain';

export type PrismaAccountRow = {
  id: string;
  companyId: string;
  identifier: string;
  role: string;
  status: AccountStatus;
  invitationToken: string | null;
  secretHash: string | null;
};

export function toAccount(row: PrismaAccountRow): Account {
  return new Account(
    row.id,
    row.companyId,
    AccountIdentifier.parse(row.identifier),
    parseUserRole(row.role),
    row.status,
    row.invitationToken,
    row.secretHash,
  );
}
