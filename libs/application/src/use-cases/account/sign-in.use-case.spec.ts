import {
  InMemoryAccountRepository,
  InMemorySecretHasher,
  InMemorySignInSession,
} from '@hexagonal-monorepo-template/adapters';
import {
  Account,
  AccountIdentifier,
  AccountStatus,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { SignInUseCase } from './sign-in.use-case';

async function activeEmployer(
  accounts: InMemoryAccountRepository,
  secrets: InMemorySecretHasher,
): Promise<Account> {
  const invited = Account.inviteEmployer(
    'account-1',
    'company-1',
    AccountIdentifier.parse('founder'),
    'invite-1',
  );
  await accounts.insert(invited);
  const activated = invited.activate(await secrets.hash('s3cret'));
  await accounts.save(activated);
  return activated;
}

describe('SignInUseCase', () => {
  it('opens the company space for an active account with the right secret', async () => {
    const accounts = new InMemoryAccountRepository();
    const secrets = new InMemorySecretHasher();
    const sessions = new InMemorySignInSession();
    await activeEmployer(accounts, secrets);
    const useCase = new SignInUseCase(accounts, secrets, sessions);

    const session = await useCase.execute({
      identifier: 'founder',
      secret: 's3cret',
    });

    expect(session).toEqual({
      accessToken: 'session:founder',
      companyId: 'company-1',
      role: UserRole.EMPLOYER,
    });
  });

  it('refuses a wrong secret without saying if the identifier exists', async () => {
    const accounts = new InMemoryAccountRepository();
    const secrets = new InMemorySecretHasher();
    await activeEmployer(accounts, secrets);
    const useCase = new SignInUseCase(
      accounts,
      secrets,
      new InMemorySignInSession(),
    );

    await expect(
      useCase.execute({ identifier: 'founder', secret: 'wrong' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses an unknown identifier with the same phrase', async () => {
    const useCase = new SignInUseCase(
      new InMemoryAccountRepository(),
      new InMemorySecretHasher(),
      new InMemorySignInSession(),
    );

    await expect(
      useCase.execute({ identifier: 'missing', secret: 's3cret' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses an invited account', async () => {
    const accounts = new InMemoryAccountRepository();
    await accounts.insert(
      Account.inviteEmployer(
        'account-1',
        'company-1',
        AccountIdentifier.parse('founder'),
        'invite-1',
      ),
    );
    const useCase = new SignInUseCase(
      accounts,
      new InMemorySecretHasher(),
      new InMemorySignInSession(),
    );

    await expect(
      useCase.execute({ identifier: 'founder', secret: 's3cret' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses a disabled account', async () => {
    const accounts = new InMemoryAccountRepository();
    const secrets = new InMemorySecretHasher();
    const invited = Account.inviteEmployer(
      'account-1',
      'company-1',
      AccountIdentifier.parse('founder'),
      'invite-1',
    );
    const activated = invited.activate(await secrets.hash('s3cret'));
    await accounts.insert(
      new Account(
        activated.id,
        activated.companyId,
        activated.identifier,
        activated.role,
        AccountStatus.DISABLED,
        null,
        activated.secretHash,
      ),
    );
    const useCase = new SignInUseCase(
      accounts,
      secrets,
      new InMemorySignInSession(),
    );

    await expect(
      useCase.execute({ identifier: 'founder', secret: 's3cret' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('locks the account on the fifth wrong secret', async () => {
    const accounts = new InMemoryAccountRepository();
    const secrets = new InMemorySecretHasher();
    await activeEmployer(accounts, secrets);
    const useCase = new SignInUseCase(
      accounts,
      secrets,
      new InMemorySignInSession(),
    );

    for (let attempt = 0; attempt < 4; attempt += 1) {
      await expect(
        useCase.execute({ identifier: 'founder', secret: 'wrong' }),
      ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    }

    await expect(
      useCase.execute({ identifier: 'founder', secret: 'wrong' }),
    ).rejects.toThrow(ErrorCode.ACCOUNT_LOCKED);
  });

  it('keeps the lock even when the secret is then correct', async () => {
    const accounts = new InMemoryAccountRepository();
    const secrets = new InMemorySecretHasher();
    await activeEmployer(accounts, secrets);
    const useCase = new SignInUseCase(
      accounts,
      secrets,
      new InMemorySignInSession(),
    );

    for (let attempt = 0; attempt < 5; attempt += 1) {
      await useCase.execute({ identifier: 'founder', secret: 'wrong' }).catch(() => undefined);
    }

    await expect(
      useCase.execute({ identifier: 'founder', secret: 's3cret' }),
    ).rejects.toThrow(ErrorCode.ACCOUNT_LOCKED);
  });

  it('resets the failed sign-in count after a successful connection', async () => {
    const accounts = new InMemoryAccountRepository();
    const secrets = new InMemorySecretHasher();
    await activeEmployer(accounts, secrets);
    const useCase = new SignInUseCase(
      accounts,
      secrets,
      new InMemorySignInSession(),
    );

    for (let attempt = 0; attempt < 4; attempt += 1) {
      await useCase
        .execute({ identifier: 'founder', secret: 'wrong' })
        .catch(() => undefined);
    }
    await useCase.execute({ identifier: 'founder', secret: 's3cret' });

    await expect(
      useCase.execute({ identifier: 'founder', secret: 'wrong' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
