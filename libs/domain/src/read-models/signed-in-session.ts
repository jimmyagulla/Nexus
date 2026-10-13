import { UserRole } from '../identity/user-role';

export type SignedInSession = {
  accessToken: string;
  companyId: string;
  role: UserRole;
};
