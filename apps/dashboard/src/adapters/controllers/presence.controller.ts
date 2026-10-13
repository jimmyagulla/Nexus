import {
  PresenceListFilter,
  PresenceListSnapshot,
  PresenceSnapshot,
} from '@hexagonal-monorepo-template/domain';
import {
  IAdjustPresenceWorkedDaysFromSession,
  IListPresencesFromSession,
  IOpenPresenceFromSession,
} from '@hexagonal-monorepo-template/ports';

export class PresenceController {
  constructor(
    private readonly listFromSession: IListPresencesFromSession,
    private readonly openFromSession: IOpenPresenceFromSession,
    private readonly adjustFromSession: IAdjustPresenceWorkedDaysFromSession,
  ) {}

  list(filter: PresenceListFilter = {}): Promise<PresenceListSnapshot> {
    return this.listFromSession.execute(filter);
  }

  open(input: { employeeId: string; month: string }): Promise<PresenceSnapshot> {
    return this.openFromSession.execute(input);
  }

  adjustWorkedDays(input: {
    presenceId: string;
    workedDays: number;
  }): Promise<PresenceSnapshot> {
    return this.adjustFromSession.execute(input);
  }
}
