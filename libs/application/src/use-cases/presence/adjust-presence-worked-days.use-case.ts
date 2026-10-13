import {
  ActorContext,
  buildPresenceSnapshot,
  EmployeeReference,
  ErrorCode,
  Presence,
  PresenceFactSources,
  PresenceSnapshot,
  requireEmployerOfCompany,
} from '@hexagonal-monorepo-template/domain';
import {
  IAbsenceFactSource,
  IAdjustPresenceWorkedDays,
  IClock,
  IEmployeeDirectory,
  IHoursFactSource,
  IPresenceRepository,
  ISickLeaveDocumentSource,
} from '@hexagonal-monorepo-template/ports';

export class AdjustPresenceWorkedDaysUseCase
  implements IAdjustPresenceWorkedDays
{
  constructor(
    private readonly employees: IEmployeeDirectory,
    private readonly absences: IAbsenceFactSource,
    private readonly sickLeaves: ISickLeaveDocumentSource,
    private readonly hours: IHoursFactSource,
    private readonly presences: IPresenceRepository,
    private readonly clock: IClock,
  ) {}

  async execute(input: {
    actor: ActorContext;
    companyId: string;
    presenceId: string;
    workedDays: number;
  }): Promise<PresenceSnapshot> {
    requireEmployerOfCompany(input.actor, input.companyId);
    const presence = await this.requirePresence(
      input.companyId,
      input.presenceId,
    );
    const employee = await this.requireEmployee(presence);
    const adjusted = presence.adjustWorkedDays(
      input.workedDays,
      input.actor.userId,
      this.clock.now(),
    );
    await this.presences.save(adjusted);
    return buildPresenceSnapshot(adjusted, employee, this.factSources());
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
