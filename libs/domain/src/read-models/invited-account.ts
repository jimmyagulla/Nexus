import { AccountStatus } from '../identity/account-status';
import { UserRole } from '../identity/user-role';

export type InvitedAccount = {
  id: string;
  identifier: string;
  role: UserRole;
  status: AccountStatus;
  invitationToken: string;
};
