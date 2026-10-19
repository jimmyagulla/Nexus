import { PersonalInfoSnapshot } from '@hexagonal-monorepo-template/domain';
import {
  IGetPersonalInfoFromSession,
  IPersonalInfoGateway,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';
import { currentCompanySession } from '../../session/current-company-session';

export class GetPersonalInfoFromSessionUseCase implements IGetPersonalInfoFromSession {
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly personalInfos: IPersonalInfoGateway,
  ) {}

  async execute(): Promise<PersonalInfoSnapshot> {
    const session = await currentCompanySession(this.sessions);
    return this.personalInfos.get(session.companyId, session.userId, session.token);
  }
}
