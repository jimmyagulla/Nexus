import {
  ActorContext,
  buildPresenceSnapshot,
  EmployeeReference,
  Presence,
  PresenceFactSources,
  PresenceListSnapshot,
  PresenceSnapshot,
  requireEmployerOfCompany,
} from '@hexagonal-monorepo-template/domain';
import {
  IAbsenceFactSource,
  IEmployeeDirectory,
  IHoursFactSource,
  IListPresences,
  IPresenceRepository,
  ISickLeaveDocumentSource,
} from '@hexagonal-monorepo-template/ports';

export class ListPresencesUseCase implements IListPresences {
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
  }): Promise<PresenceListSnapshot> {
    requireEmployerOfCompany(input.actor, input.companyId);
    const employees = await this.employees.listInCompany(input.companyId);
    const presences = await this.presences.list({
      companyId: input.companyId,
    });
    return {
      presences: await this.presentMostRecentFirst(presences, employees),
      employees,
      canManage: true,
    };
  }

  private async presentMostRecentFirst(
    presences: readonly Presence[],
    employees: readonly EmployeeReference[],
  ): Promise<PresenceSnapshot[]> {
    const known = new Map(employees.map((employee) => [employee.id, employee]));
    const snapshots = await Promise.all(
      presences.flatMap((presence) => {
        const employee = known.get(presence.employeeId);
        return employee === undefined
          ? []
          : [buildPresenceSnapshot(presence, employee, this.factSources())];
      }),
    );
    return snapshots.sort((first, second) =>
      this.mostRecentMonthFirst(first, second),
    );
  }

  private factSources(): PresenceFactSources {
    return {
      absences: (companyId, employeeId) =>
        this.absences.listForEmployee(companyId, employeeId),
      sickLeaves: (companyId, employeeId) =>
        this.sickLeaves.listForEmployee(companyId, employeeId),
      hours: (companyId, employeeId) =>
        this.hours.listForEmployee(companyId, employeeId),
    };
  }

  private mostRecentMonthFirst(
    first: PresenceSnapshot,
    second: PresenceSnapshot,
  ): number {
    return (
      second.month.localeCompare(first.month) ||
      first.employeeName.localeCompare(second.employeeName)
    );
  }
}
