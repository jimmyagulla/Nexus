import { UserRole } from '@hexagonal-monorepo-template/domain';
import { IGetCurrentRoleFromSession } from '@hexagonal-monorepo-template/ports';

export class NavigationController {
  constructor(private readonly roleFromSession: IGetCurrentRoleFromSession) {}

  currentRole(): Promise<UserRole | null> {
    return this.roleFromSession.execute();
  }
}
