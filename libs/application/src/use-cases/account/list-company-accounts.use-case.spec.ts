import { InMemoryAccountRepository } from '@hexagonal-monorepo-template/adapters';
import {
  Account,
  AccountIdentifier,
  AccountStatus,
  ActorContext,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { ListCompanyAccountsUseCase } from './list-company-accounts.use-case';

const employer: ActorContext = {
  userId: 'founder',
  companyId: 'company-1',
  role: UserRole.EMPLOYER,
};

function invited(id: string, companyId: string): Account {
  return Account.inviteEmployer(
    id,
    companyId,
    AccountIdentifier.parse(id),
    `invite-${id}`,
  );
}

describe('ListCompanyAccountsUseCase', () => {
  it('lists the identifier, the role and the status of the company accounts', async () => {
    const accounts = new InMemoryAccountRepository();
    await accounts.insert(invited('founder', 'company-1').activate('hash'));
    await accounts.insert(invited('guest', 'company-1'));

    await expect(
      new ListCompanyAccountsUseCase(accounts).execute({ actor: employer }),
    ).resolves.toEqual([
      {
        id: 'founder',
        identifier: 'founder',
        role: UserRole.EMPLOYER,
        status: AccountStatus.ACTIVE,
        locked: false,
      },
      {
        id: 'guest',
        identifier: 'guest',
        role: UserRole.EMPLOYER,
        status: AccountStatus.INVITED,
        locked: false,
      },
    ]);
  });

  it('never shows the secret nor the invitation of an account', async () => {
    const accounts = new InMemoryAccountRepository();
    await accounts.insert(invited('founder', 'company-1'));
    await accounts.insert(invited('partner', 'company-1').activate('hash'));

    const listed = await new ListCompanyAccountsUseCase(accounts).execute({
      actor: employer,
    });

    expect(JSON.stringify(listed)).not.toMatch(/hash|invite-/);
  });

  it('shows the accounts of the company of the actor and no other', async () => {
    const accounts = new InMemoryAccountRepository();
    await accounts.insert(invited('founder', 'company-1'));
    await accounts.insert(invited('stranger', 'company-2'));

    const listed = await new ListCompanyAccountsUseCase(accounts).execute({
      actor: employer,
    });

    expect(listed.map(({ id }) => id)).toEqual(['founder']);
  });

  it.each([UserRole.EMPLOYEE, UserRole.ACCOUNTANT])(
    'refuses an actor with the role %s',
    async (role) => {
      const accounts = new InMemoryAccountRepository();
      await accounts.insert(invited('founder', 'company-1'));

      await expect(
        new ListCompanyAccountsUseCase(accounts).execute({
          actor: { ...employer, role },
        }),
      ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    },
  );
});
