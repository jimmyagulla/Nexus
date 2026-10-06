import { UserRole } from './user-role';

export type ActorContext = {
  userId: string;
  companyId: string | null;
  role: UserRole | null;
};
