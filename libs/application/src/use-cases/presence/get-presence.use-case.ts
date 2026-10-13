import {
  ActorContext,
  assertSameCompany,
  buildPresenceSnapshot,
  EmployeeReference,
  ErrorCode,
  Presence,
  PresenceFactSources,
  PresenceSnapshot,
  requireEmployerOfCompany,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import {
  IAbsenceFactSource,
  IEmployeeDirectory,
  IGetPresence,
  IHoursFactSource,
  IPresenceRepository,
  ISickLeaveDocumentSource,
} from '@hexagonal-monorepo-template/ports';

export class GetPresenceUseCase implements IGetPresence {
  constructor(
    private readonly employees: IEmployeeDirectory,
    private readonly absences: IAbsenceFactSource,
    private readonly sickLeaves: ISickLeaveDocumentSource,
    private readonly hours: IHoursFactSource,
    private readonly presences: IPresenceRepository,
  ) {}

  async execute(input: {
    actor: ActorContext;
    companyId: string;
    presenceId: string;
  }): Promise<PresenceSnapshot> {
    const presence = await this.requirePresence(
      input.companyId,
      input.presenceId,
    );
    const employee = await this.requireReadableEmployee(
      input.actor,
      input.companyId,
      presence,
    );
    return buildPresenceSnapshot(presence, employee, this.factSources());
  }

  private async requirePresence(
    companyId: string,
    presenceId: string,
  ): Promise<Presence> {
    const presence = await this.presences.findById(companyId, presenceId);
    if (presence === null) {
      throw new Error(ErrorCode.ACCESS_DENIED);
    }
    return presence;
  }

  private async requireReadableEmployee(
    actor: ActorContext,
    companyId: string,
    presence: Presence,
  ): Promise<EmployeeReference> {
    if (actor.role === UserRole.EMPLOYER) {
      requireEmployerOfCompany(actor, companyId);
    } else if (actor.role === UserRole.EMPLOYEE) {
      await this.requireOwnPresence(actor, companyId, presence);
    } else {
      throw new Error(ErrorCode.ACCESS_DENIED);
    }

    return this.requireEmployee(presence);
  }

  private async requireOwnPresence(
    actor: ActorContext,
    companyId: string,
    presence: Presence,
  ): Promise<void> {
    assertSameCompany(companyId, actor.companyId);
    const own = await this.employees.findByUserId(companyId, actor.userId);
    if (own === null || own.id !== presence.employeeId) {
      throw new Error(ErrorCode.ACCESS_DENIED);
    }
  }

  private async requireEmployee(
    presence: Presence,
  ): Promise<EmployeeReference> {
    const employee = await this.employees.findInCompany(
      presence.companyId,
      presence.employeeId,
    );
    if (employee === null) {
      throw new Error(ErrorCode.ACCESS_DENIED);
    }
    return employee;
  }

  private factSources(): PresenceFactSources {
    return {
      absences: this.absences,
      sickLeaves: this.sickLeaves,
      hours: this.hours,
    };
  }
}
