import {
  Account,
  AccountIdentifier,
  ActorContext,
  assertEmployerActor,
  Employee,
  EmployeeInvitation,
  ErrorCode,
  requireAccessibleEmployee,
} from '@hexagonal-monorepo-template/domain';
import {
  IAccountRepository,
  IEmployeeRepository,
  IIdGenerator,
  IInviteEmployee,
} from '@hexagonal-monorepo-template/ports';

export class InviteEmployeeUseCase implements IInviteEmployee {
  constructor(
    private readonly employees: IEmployeeRepository,
    private readonly accounts: IAccountRepository,
    private readonly ids: IIdGenerator,
  ) {}

  async execute(input: {
    actor: ActorContext;
    employeeId: string;
    identifier: string;
  }): Promise<EmployeeInvitation> {
    assertEmployerActor(input.actor);
    const employee = await this.loadAccessibleEmployee(
      input.actor,
      input.employeeId,
    );
    await this.requireNoAccountFor(employee);
    const identifier = AccountIdentifier.parse(input.identifier);
    await this.requireFreeIdentifier(identifier);
    return this.openInvitedAccount(employee, identifier);
  }

  private loadAccessibleEmployee(
    actor: ActorContext,
    employeeId: string,
  ): Promise<Employee> {
    return requireAccessibleEmployee(employeeId, actor.companyId, (id) =>
      this.employees.findById(id),
    );
  }

  private async requireNoAccountFor(employee: Employee): Promise<void> {
    if ((await this.accounts.findByEmployeeId(employee.id)) !== null) {
      throw new Error(ErrorCode.POTENTIAL_DUPLICATE);
    }
  }

  private async requireFreeIdentifier(
    identifier: AccountIdentifier,
  ): Promise<void> {
    if ((await this.accounts.findByIdentifier(identifier.value)) !== null) {
      throw new Error(ErrorCode.POTENTIAL_DUPLICATE);
    }
  }

  private async openInvitedAccount(
    employee: Employee,
    identifier: AccountIdentifier,
  ): Promise<EmployeeInvitation> {
    const invitationToken = this.ids.generate();
    const account = Account.inviteEmployee(
      this.ids.generate(),
      employee.companyId,
      identifier,
      invitationToken,
      employee.id,
    );
    await this.accounts.insert(account);
    return {
      employeeId: employee.id,
      accountId: account.id,
      identifier: identifier.value,
      invitationToken,
    };
  }
}
