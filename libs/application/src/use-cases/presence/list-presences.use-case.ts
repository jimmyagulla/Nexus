import {
  ActorContext,
  EmployeeReference,
  Presence,
  PresenceListSnapshot,
  PresenceSnapshot,
  requireEmployerOfCompany,
  toPresenceSnapshot,
} from '@hexagonal-monorepo-template/domain';
import {
  IEmployeeDirectory,
  IListPresences,
  IPresenceRepository,
} from '@hexagonal-monorepo-template/ports';

export class ListPresencesUseCase implements IListPresences {
  constructor(
    private readonly employees: IEmployeeDirectory,
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
      presences: this.presentMostRecentFirst(presences, employees),
      employees,
      canManage: true,
    };
  }

  private presentMostRecentFirst(
    presences: readonly Presence[],
    employees: readonly EmployeeReference[],
  ): PresenceSnapshot[] {
    const known = new Map(employees.map((employee) => [employee.id, employee]));
    return presences
      .flatMap((presence) => {
        const employee = known.get(presence.employeeId);
        return employee === undefined
          ? []
          : [toPresenceSnapshot(presence, employee)];
      })
      .sort((first, second) => this.mostRecentMonthFirst(first, second));
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
