import {
  ActorContext,
  PersonalContact,
  PersonalContactValues,
  PersonalInfo,
  PersonalInfoSnapshot,
  requireEditablePersonalInfo,
  requireReadablePersonalInfo,
  toPersonalInfoSnapshot,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { IClock, IPersonalInfoGateway } from '@hexagonal-monorepo-template/ports';

/**
 * The personal information of the API, kept in the process. A token stands
 * for the person it was issued to: an employee unless `roles` says otherwise.
 * The API rules apply: the employee reads and edits their own information, an
 * employer of the company only reads them.
 */
export class InMemoryPersonalInfoGateway implements IPersonalInfoGateway {
  private readonly infos = new Map<string, PersonalInfo>();

  constructor(
    infos: readonly PersonalInfo[],
    private readonly clock: IClock,
    private readonly roles: ReadonlyMap<string, UserRole> = new Map(),
  ) {
    infos.forEach((info) => this.infos.set(this.keyOf(info.companyId, info.employeeId), info));
  }

  async get(companyId: string, employeeId: string, token: string): Promise<PersonalInfoSnapshot> {
    const info = requireReadablePersonalInfo(
      this.find(companyId, employeeId),
      this.actorOf(companyId, token),
    );
    return toPersonalInfoSnapshot(info);
  }

  async updateContact(
    companyId: string,
    employeeId: string,
    contact: PersonalContactValues,
    token: string,
  ): Promise<PersonalInfoSnapshot> {
    const info = requireEditablePersonalInfo(
      this.find(companyId, employeeId),
      this.actorOf(companyId, token),
    );
    const updated = info.withContact(PersonalContact.parse(contact), this.clock.now());
    this.infos.set(this.keyOf(companyId, employeeId), updated);
    return toPersonalInfoSnapshot(updated);
  }

  private find(companyId: string, employeeId: string): PersonalInfo | null {
    return this.infos.get(this.keyOf(companyId, employeeId)) ?? null;
  }

  private actorOf(companyId: string, token: string): ActorContext {
    return { userId: token, companyId, role: this.roles.get(token) ?? UserRole.EMPLOYEE };
  }

  private keyOf(companyId: string, employeeId: string): string {
    return `${companyId}/${employeeId}`;
  }
}
