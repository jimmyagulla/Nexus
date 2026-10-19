import {
  PersonalContactValues,
  PersonalInfoSnapshot,
} from '@hexagonal-monorepo-template/domain';
import {
  IPersonalInfoGateway,
  ISessionGateway,
  IUpdatePersonalContactFromSession,
} from '@hexagonal-monorepo-template/ports';
import { currentCompanySession } from '../../session/current-company-session';

export class UpdatePersonalContactFromSessionUseCase
  implements IUpdatePersonalContactFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly personalInfos: IPersonalInfoGateway,
  ) {}

  async execute(contact: PersonalContactValues): Promise<PersonalInfoSnapshot> {
    const session = await currentCompanySession(this.sessions);
    return this.personalInfos.updateContact(
      session.companyId,
      session.userId,
      contact,
      session.token,
    );
  }
}
