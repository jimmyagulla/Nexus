import {
  ActorContext,
  PersonalInfoSnapshot,
  requireReadablePersonalInfo,
  toPersonalInfoSnapshot,
} from '@hexagonal-monorepo-template/domain';
import {
  IGetPersonalInfo,
  IPersonalInfoRepository,
} from '@hexagonal-monorepo-template/ports';
import { employeeScope } from '../../personal-info/employee-scope';

export class GetPersonalInfoUseCase implements IGetPersonalInfo {
  constructor(private readonly personalInfos: IPersonalInfoRepository) {}

  async execute(input: {
    actor: ActorContext;
    employeeId: string;
  }): Promise<PersonalInfoSnapshot> {
    const info = requireReadablePersonalInfo(
      await this.personalInfos.findByEmployee(employeeScope(input.actor, input.employeeId)),
      input.actor,
    );
    return toPersonalInfoSnapshot(info);
  }
}
