import {
  ActorContext,
  PersonalContact,
  PersonalContactValues,
  PersonalInfo,
  PersonalInfoSnapshot,
  requireEditablePersonalInfo,
  toPersonalInfoSnapshot,
} from '@hexagonal-monorepo-template/domain';
import {
  IClock,
  IPersonalInfoRepository,
  IUpdatePersonalContact,
} from '@hexagonal-monorepo-template/ports';
import { employeeScope } from '../../personal-info/employee-scope';

export class UpdatePersonalContactUseCase implements IUpdatePersonalContact {
  constructor(
    private readonly personalInfos: IPersonalInfoRepository,
    private readonly clock: IClock,
  ) {}

  async execute(input: {
    actor: ActorContext;
    employeeId: string;
    contact: PersonalContactValues;
  }): Promise<PersonalInfoSnapshot> {
    const info = await this.editableInfo(input.actor, input.employeeId);
    const updated = info.withContact(PersonalContact.parse(input.contact), this.clock.now());
    await this.personalInfos.save(updated);
    return toPersonalInfoSnapshot(updated);
  }

  private async editableInfo(actor: ActorContext, employeeId: string): Promise<PersonalInfo> {
    return requireEditablePersonalInfo(
      await this.personalInfos.findByEmployee(employeeScope(actor, employeeId)),
      actor,
    );
  }
}
