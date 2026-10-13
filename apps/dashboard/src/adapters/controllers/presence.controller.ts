import {
  PresenceListSnapshot,
  PresenceSnapshot,
} from '@hexagonal-monorepo-template/domain';
import {
  IListPresencesFromSession,
  IOpenPresenceFromSession,
} from '@hexagonal-monorepo-template/ports';

export class PresenceController {
  constructor(
    private readonly listFromSession: IListPresencesFromSession,
    private readonly openFromSession: IOpenPresenceFromSession,
  ) {}

  list(): Promise<PresenceListSnapshot> {
    return this.listFromSession.execute();
  }

  open(input: { employeeId: string; month: string }): Promise<PresenceSnapshot> {
    return this.openFromSession.execute(input);
  }
}
