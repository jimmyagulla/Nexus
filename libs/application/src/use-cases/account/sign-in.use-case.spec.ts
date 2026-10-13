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
  AuditAction,
  AuditSubject,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { SignInUseCase } from './sign-in.use-case';

const SIGNED_IN_AT = new Date('2026-10-13T12:00:00.000Z');

function signInUseCase(
  accounts: InMemoryAccountRepository,
  secrets: InMemorySecretHasher,
  sessions = new InMemorySignInSession(),
  audits = new InMemoryAuditLogRepository(),
) {
  return new SignInUseCase(
    accounts,
    secrets,
    sessions,
    audits,
    new FixedClock(SIGNED_IN_AT),
  );
}

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
    await activeEmployer(accounts, secrets);
    const useCase = signInUseCase(accounts, secrets);

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

  it('records who connected, when, and to which company', async () => {
    const accounts = new InMemoryAccountRepository();
    const secrets = new InMemorySecretHasher();
    const audits = new InMemoryAuditLogRepository();
    await activeEmployer(accounts, secrets);
    const useCase = signInUseCase(
      accounts,
      secrets,
      new InMemorySignInSession(),
      audits,
    );

    await useCase.execute({ identifier: 'founder', secret: 's3cret' });

    expect(await audits.listByCompany('company-1')).toEqual([
      {
        id: expect.stringMatching(
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
        ),
        companyId: 'company-1',
        actorId: 'founder',
        occurredAt: SIGNED_IN_AT,
        action: AuditAction.CONNECTION,
        subject: AuditSubject.ACCOUNT,
        before: null,
        after: null,
      },
    ]);
  });

  it('does not record a refused sign-in', async () => {
    const accounts = new InMemoryAccountRepository();
    const secrets = new InMemorySecretHasher();
    const audits = new InMemoryAuditLogRepository();
    await activeEmployer(accounts, secrets);
    const useCase = signInUseCase(
      accounts,
      secrets,
      new InMemorySignInSession(),
      audits,
    );

    await expect(
      useCase.execute({ identifier: 'founder', secret: 'wrong' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);

    expect(await audits.listByCompany('company-1')).toEqual([]);
  });

  it('refuses a wrong secret without saying if the identifier exists', async () => {
    const accounts = new InMemoryAccountRepository();
    const secrets = new InMemorySecretHasher();
    await activeEmployer(accounts, secrets);
    const useCase = signInUseCase(accounts, secrets);

    await expect(
      useCase.execute({ identifier: 'founder', secret: 'wrong' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses an unknown identifier with the same phrase', async () => {
    const useCase = signInUseCase(
      new InMemoryAccountRepository(),
      new InMemorySecretHasher(),
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
    const useCase = signInUseCase(accounts, new InMemorySecretHasher());

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
    const useCase = signInUseCase(accounts, secrets);

    await expect(
      useCase.execute({ identifier: 'founder', secret: 's3cret' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('locks the account on the fifth wrong secret', async () => {
    const accounts = new InMemoryAccountRepository();
    const secrets = new InMemorySecretHasher();
    await activeEmployer(accounts, secrets);
    const useCase = signInUseCase(accounts, secrets);

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
    const useCase = signInUseCase(accounts, secrets);

    for (let attempt = 0; attempt < 5; attempt += 1) {
      await useCase
        .execute({ identifier: 'founder', secret: 'wrong' })
        .catch(() => undefined);
    }

    await expect(
      useCase.execute({ identifier: 'founder', secret: 's3cret' }),
    ).rejects.toThrow(ErrorCode.ACCOUNT_LOCKED);
  });

  it('resets the failed sign-in count after a successful connection', async () => {
    const accounts = new InMemoryAccountRepository();
    const secrets = new InMemorySecretHasher();
    await activeEmployer(accounts, secrets);
    const useCase = signInUseCase(accounts, secrets);

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
