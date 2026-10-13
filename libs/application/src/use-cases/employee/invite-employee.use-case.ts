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
    const identifier = AccountIdentifier.parse(input.identifier);
    const existing = await this.accounts.findByEmployeeId(employee.id);
    const invited =
      existing === null
        ? await this.openInvitedAccount(employee, identifier)
        : await this.reissueInvitation(existing, identifier);
    return this.toInvitation(invited);
  }

  private loadAccessibleEmployee(
    actor: ActorContext,
    employeeId: string,
  ): Promise<Employee> {
    return requireAccessibleEmployee(employeeId, actor.companyId, (id) =>
      this.employees.findById(id),
    );
  }

  private async openInvitedAccount(
    employee: Employee,
    identifier: AccountIdentifier,
  ): Promise<Account> {
    await this.requireFreeIdentifier(identifier, null);
    const account = Account.inviteEmployee(
      this.ids.generate(),
      employee.companyId,
      identifier,
      this.ids.generate(),
      employee.id,
    );
    await this.accounts.insert(account);
    return account;
  }

  private async reissueInvitation(
    existing: Account,
    identifier: AccountIdentifier,
  ): Promise<Account> {
    const reissued = existing.reissueInvitation(this.ids.generate(), identifier);
    await this.requireFreeIdentifier(identifier, existing.id);
    await this.accounts.save(reissued);
    return reissued;
  }

  private async requireFreeIdentifier(
    identifier: AccountIdentifier,
    ownAccountId: string | null,
  ): Promise<void> {
    const holder = await this.accounts.findByIdentifier(identifier.value);
    if (holder !== null && holder.id !== ownAccountId) {
      throw new Error(ErrorCode.POTENTIAL_DUPLICATE);
    }
  }

  private toInvitation(account: Account): EmployeeInvitation {
    return {
      employeeId: account.employeeId ?? '',
      accountId: account.id,
      identifier: account.identifier.value,
      invitationToken: account.invitationToken ?? '',
    };
  }
}
