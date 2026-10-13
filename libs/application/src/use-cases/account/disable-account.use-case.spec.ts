import { InMemoryAccountRepository } from '@hexagonal-monorepo-template/adapters';
import {
  Account,
  AccountIdentifier,
  AccountStatus,
  ActorContext,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { DisableAccountUseCase } from './disable-account.use-case';

const employer: ActorContext = {
  userId: 'founder',
  companyId: 'company-1',
  role: UserRole.EMPLOYER,
};

function activeEmployer(id: string, companyId = 'company-1'): Account {
  return Account.inviteEmployer(
    id,
    companyId,
    AccountIdentifier.parse(id),
    `invite-${id}`,
  ).activate('hashed-secret');
}

async function companyOfTwoEmployers(): Promise<InMemoryAccountRepository> {
  const accounts = new InMemoryAccountRepository();
  await accounts.insert(activeEmployer('founder'));
  await accounts.insert(activeEmployer('partner'));
  return accounts;
}

describe('DisableAccountUseCase', () => {
  it('moves an active account to disabled', async () => {
    const accounts = await companyOfTwoEmployers();

    const disabled = await new DisableAccountUseCase(accounts).execute({
      actor: employer,
      accountId: 'partner',
    });

    expect(disabled).toEqual({
      id: 'partner',
      identifier: 'partner',
      role: UserRole.EMPLOYER,
      status: AccountStatus.DISABLED,
      locked: false,
    });
    expect((await accounts.findByIdentifier('partner'))?.status).toBe(
      AccountStatus.DISABLED,
    );
  });

  it('keeps the data of the disabled account', async () => {
    const accounts = await companyOfTwoEmployers();

    await new DisableAccountUseCase(accounts).execute({
      actor: employer,
      accountId: 'partner',
    });

    const kept = await accounts.findByIdentifier('partner');
    expect(kept?.secretHash).toBe('hashed-secret');
    expect(kept?.companyId).toBe('company-1');
  });

  it('refuses to disable the last active employer', async () => {
    const accounts = new InMemoryAccountRepository();
    await accounts.insert(activeEmployer('founder'));

    await expect(
      new DisableAccountUseCase(accounts).execute({
        actor: employer,
        accountId: 'founder',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    expect((await accounts.findByIdentifier('founder'))?.status).toBe(
      AccountStatus.ACTIVE,
    );
  });

  it('refuses to disable the last active employer once the other one is disabled', async () => {
    const accounts = await companyOfTwoEmployers();
    const useCase = new DisableAccountUseCase(accounts);
    await useCase.execute({ actor: employer, accountId: 'partner' });

    await expect(
      useCase.execute({ actor: employer, accountId: 'founder' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses an account of another company like an unknown account', async () => {
    const accounts = await companyOfTwoEmployers();
    await accounts.insert(activeEmployer('stranger', 'company-2'));
    await accounts.insert(activeEmployer('stranger-peer', 'company-2'));

    await expect(
      new DisableAccountUseCase(accounts).execute({
        actor: employer,
        accountId: 'stranger',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    expect((await accounts.findByIdentifier('stranger'))?.status).toBe(
      AccountStatus.ACTIVE,
    );
  });

  it('refuses an unknown account', async () => {
    await expect(
      new DisableAccountUseCase(await companyOfTwoEmployers()).execute({
        actor: employer,
        accountId: 'missing',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses an account that is not active', async () => {
    const accounts = await companyOfTwoEmployers();
    await accounts.insert(
      Account.inviteEmployer(
        'guest',
        'company-1',
        AccountIdentifier.parse('guest'),
        'invite-guest',
      ),
    );

    await expect(
      new DisableAccountUseCase(accounts).execute({
        actor: employer,
        accountId: 'guest',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it.each([UserRole.EMPLOYEE, UserRole.ACCOUNTANT])(
    'refuses an actor with the role %s',
    async (role) => {
      const accounts = await companyOfTwoEmployers();

      await expect(
        new DisableAccountUseCase(accounts).execute({
          actor: { ...employer, role },
          accountId: 'partner',
        }),
      ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
      expect((await accounts.findByIdentifier('partner'))?.status).toBe(
        AccountStatus.ACTIVE,
      );
    },
  );
});
