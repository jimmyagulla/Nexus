import {
  FixedClock,
  InMemoryAccountRepository,
  InMemoryAuditLogRepository,
  InMemorySecretHasher,
  InMemorySignInSession,
} from '@hexagonal-monorepo-template/adapters';
import {
  Account,
  AccountIdentifier,
  AccountStatus,
  ActorContext,
  ErrorCode,
  FAILED_SIGN_IN_LIMIT,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { RestoreAccountUseCase } from './restore-account.use-case';
import { SignInUseCase } from './sign-in.use-case';

const employer: ActorContext = {
  userId: 'founder',
  companyId: 'company-1',
  role: UserRole.EMPLOYER,
};

async function activeEmployer(
  id: string,
  secrets: InMemorySecretHasher,
  companyId = 'company-1',
): Promise<Account> {
  return Account.inviteEmployer(
    id,
    companyId,
    AccountIdentifier.parse(id),
    `invite-${id}`,
  ).activate(await secrets.hash('s3cret'));
}

function lock(account: Account): Account {
  let locked = account;
  for (let i = 0; i < FAILED_SIGN_IN_LIMIT; i += 1) {
    locked = locked.recordFailedSignIn();
  }
  return locked;
}

function signIn(accounts: InMemoryAccountRepository, secrets: InMemorySecretHasher) {
  return new SignInUseCase(
    accounts,
    secrets,
    new InMemorySignInSession(),
    new InMemoryAuditLogRepository(),
    new FixedClock(new Date('2026-10-13T12:00:00.000Z')),
  );
}

describe('RestoreAccountUseCase', () => {
  it('moves a disabled account back to active', async () => {
    const secrets = new InMemorySecretHasher();
    const accounts = new InMemoryAccountRepository();
    await accounts.insert((await activeEmployer('partner', secrets)).disable());

    const restored = await new RestoreAccountUseCase(accounts).execute({
      actor: employer,
      accountId: 'partner',
    });

    expect(restored).toEqual({
      id: 'partner',
      identifier: 'partner',
      role: UserRole.EMPLOYER,
      status: AccountStatus.ACTIVE,
    });
    expect((await accounts.findByIdentifier('partner'))?.status).toBe(
      AccountStatus.ACTIVE,
    );
  });

  it('lets a person locked after five failures sign in again with their secret', async () => {
    const secrets = new InMemorySecretHasher();
    const accounts = new InMemoryAccountRepository();
    await accounts.insert(lock(await activeEmployer('partner', secrets)));
    await expect(
      signIn(accounts, secrets).execute({
        identifier: 'partner',
        secret: 's3cret',
      }),
    ).rejects.toThrow(ErrorCode.ACCOUNT_LOCKED);

    await new RestoreAccountUseCase(accounts).execute({
      actor: employer,
      accountId: 'partner',
    });

    await expect(
      signIn(accounts, secrets).execute({
        identifier: 'partner',
        secret: 's3cret',
      }),
    ).resolves.toMatchObject({ companyId: 'company-1' });
  });

  it('starts the failure count again from zero', async () => {
    const secrets = new InMemorySecretHasher();
    const accounts = new InMemoryAccountRepository();
    await accounts.insert(lock(await activeEmployer('partner', secrets)).disable());

    await new RestoreAccountUseCase(accounts).execute({
      actor: employer,
      accountId: 'partner',
    });

    expect((await accounts.findByIdentifier('partner'))?.failedSignInCount).toBe(
      0,
    );
  });

  it('refuses an account that needs no restoring', async () => {
    const secrets = new InMemorySecretHasher();
    const accounts = new InMemoryAccountRepository();
    await accounts.insert(await activeEmployer('partner', secrets));

    await expect(
      new RestoreAccountUseCase(accounts).execute({
        actor: employer,
        accountId: 'partner',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses an account of another company like an unknown account', async () => {
    const secrets = new InMemorySecretHasher();
    const accounts = new InMemoryAccountRepository();
    await accounts.insert(
      (await activeEmployer('stranger', secrets, 'company-2')).disable(),
    );

    await expect(
      new RestoreAccountUseCase(accounts).execute({
        actor: employer,
        accountId: 'stranger',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    expect((await accounts.findByIdentifier('stranger'))?.status).toBe(
      AccountStatus.DISABLED,
    );
  });

  it.each([UserRole.EMPLOYEE, UserRole.ACCOUNTANT])(
    'refuses an actor with the role %s',
    async (role) => {
      const secrets = new InMemorySecretHasher();
      const accounts = new InMemoryAccountRepository();
      await accounts.insert((await activeEmployer('partner', secrets)).disable());

      await expect(
        new RestoreAccountUseCase(accounts).execute({
          actor: { ...employer, role },
          accountId: 'partner',
        }),
      ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
      expect((await accounts.findByIdentifier('partner'))?.status).toBe(
        AccountStatus.DISABLED,
      );
    },
  );
});
