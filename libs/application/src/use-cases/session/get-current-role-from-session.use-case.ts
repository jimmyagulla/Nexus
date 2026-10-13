import { UserRole } from '@hexagonal-monorepo-template/domain';
import {
  IGetCurrentRoleFromSession,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';

export class GetCurrentRoleFromSessionUseCase
  implements IGetCurrentRoleFromSession
{
  constructor(private readonly sessions: ISessionGateway) {}

  async execute(): Promise<UserRole | null> {
    return (await this.sessions.getActor())?.role ?? null;
  }
}
