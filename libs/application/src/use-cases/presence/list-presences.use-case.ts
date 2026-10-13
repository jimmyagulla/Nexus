import {
  ActorContext,
  assertSameCompany,
  buildPresenceSnapshot,
  EmployeeReference,
  ErrorCode,
  Presence,
  PresenceFactSources,
  PresenceListSnapshot,
  parsePresencePeriod,
  PresenceSnapshot,
  requireEmployerOfCompany,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import {
  IAbsenceFactSource,
  IEmployeeDirectory,
  IHoursFactSource,
  IListPresences,
  IPresenceRepository,
  ISickLeaveDocumentSource,
  PresenceFilter,
} from '@hexagonal-monorepo-template/ports';

type PresenceScope = {
  canManage: boolean;
  filter: PresenceFilter;
  known: readonly EmployeeReference[];
  offered: readonly EmployeeReference[];
};

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
    employeeId?: string;
    from?: string;
    to?: string;
  }): Promise<PresenceListSnapshot> {
    const period = parsePresencePeriod(input.from, input.to);
    const scope = await this.scopeOf(
      input.actor,
      input.companyId,
      input.employeeId,
    );
    const presences = await this.presences.list({ ...scope.filter, ...period });
    return {
      presences: await this.presentMostRecentFirst(presences, scope.known),
      employees: scope.offered,
      canManage: scope.canManage,
    };
  }

  private async scopeOf(
    actor: ActorContext,
    companyId: string,
    employeeId: string | undefined,
  ): Promise<PresenceScope> {
    if (actor.role === UserRole.EMPLOYER) {
      return this.employerScope(actor, companyId, employeeId);
    }
    if (actor.role === UserRole.EMPLOYEE) {
      return this.employeeScope(actor, companyId);
    }
    throw new Error(ErrorCode.ACCESS_DENIED);
  }

  private async employerScope(
    actor: ActorContext,
    companyId: string,
    employeeId: string | undefined,
  ): Promise<PresenceScope> {
    requireEmployerOfCompany(actor, companyId);
    const employees = await this.employees.listInCompany(companyId);
    return {
      canManage: true,
      filter: { companyId, employeeId },
      known: employees,
      offered: employees,
    };
  }

  private async employeeScope(
    actor: ActorContext,
    companyId: string,
  ): Promise<PresenceScope> {
    assertSameCompany(companyId, actor.companyId);
    const own = await this.employees.findByUserId(companyId, actor.userId);
    if (own === null) {
      throw new Error(ErrorCode.ACCESS_DENIED);
    }
    return {
      canManage: false,
      filter: { companyId, employeeId: own.id },
      known: [own],
      offered: [],
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
      absences: this.absences,
      sickLeaves: this.sickLeaves,
      hours: this.hours,
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
