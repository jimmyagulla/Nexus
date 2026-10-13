import { Presence, PresenceMonth } from '@hexagonal-monorepo-template/domain';
import {
  IPresenceRepository,
  NewPresence,
  PresenceFilter,
} from '@hexagonal-monorepo-template/ports';

export class InMemoryPresenceRepository implements IPresenceRepository {
  constructor(private readonly presences = new Map<string, Presence>()) {}

  async insert(presence: NewPresence): Promise<Presence> {
    const inserted = new Presence(
      globalThis.crypto.randomUUID(),
      presence.companyId,
      presence.employeeId,
      presence.month,
      presence.workedDays,
    );
    this.presences.set(inserted.id, inserted);
    return inserted;
  }

  async findByEmployeeAndMonth(
    companyId: string,
    employeeId: string,
    month: PresenceMonth,
  ): Promise<Presence | null> {
    return (
      [...this.presences.values()].find(
        (presence) =>
          presence.companyId === companyId &&
          presence.employeeId === employeeId &&
          presence.month.value === month.value,
      ) ?? null
    );
  }

  async list(filter: PresenceFilter): Promise<readonly Presence[]> {
    return [...this.presences.values()].filter(
      (presence) => presence.companyId === filter.companyId,
    );
  }
}
