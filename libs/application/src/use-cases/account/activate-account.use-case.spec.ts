import {
  InMemoryAccountRepository,
  InMemorySecretHasher,
} from '@hexagonal-monorepo-template/adapters';
import {
  Account,
  AccountIdentifier,
  AccountStatus,
  ErrorCode,
} from '@hexagonal-monorepo-template/domain';
import { ActivateAccountUseCase } from './activate-account.use-case';

function invitedEmployer(): Account {
  return Account.inviteEmployer(
    'account-1',
    'company-1',
    AccountIdentifier.parse('founder'),
    'invite-1',
  );
}

describe('ActivateAccountUseCase', () => {
  it('activates the invited account with the chosen secret', async () => {
    const accounts = new InMemoryAccountRepository();
    const secrets = new InMemorySecretHasher();
    await accounts.insert(invitedEmployer());
    const useCase = new ActivateAccountUseCase(accounts, secrets);

    await useCase.execute({ invitationToken: 'invite-1', secret: 's3cret' });
    const [activated] = await accounts.listByCompany('company-1');

    expect(activated?.status).toBe(AccountStatus.ACTIVE);
    expect(activated?.invitationToken).toBeNull();
    expect(activated?.secretHash).not.toBe('s3cret');
    expect(await secrets.matches('s3cret', activated?.secretHash ?? '')).toBe(
      true,
    );
  });

  it('does not put the chosen secret in the invitation', async () => {
    const accounts = new InMemoryAccountRepository();
    const invited = invitedEmployer();
    await accounts.insert(invited);

    expect(invited.invitationToken).not.toBe('s3cret');
    expect(invited.secretHash).toBeNull();
  });

  it('rejects a consumed invitation', async () => {
    const accounts = new InMemoryAccountRepository();
    const useCase = new ActivateAccountUseCase(
      accounts,
      new InMemorySecretHasher(),
    );
    await accounts.insert(invitedEmployer());
    await useCase.execute({ invitationToken: 'invite-1', secret: 's3cret' });

    await expect(
      useCase.execute({ invitationToken: 'invite-1', secret: 'other' }),
    ).rejects.toThrow(ErrorCode.INVITATION_INVALID);
  });

  it('rejects an unknown invitation with the same phrase', async () => {
    const useCase = new ActivateAccountUseCase(
      new InMemoryAccountRepository(),
      new InMemorySecretHasher(),
    );

    await expect(
      useCase.execute({ invitationToken: 'missing', secret: 's3cret' }),
    ).rejects.toThrow(ErrorCode.INVITATION_INVALID);
  });

  it('rejects an empty secret without activating', async () => {
    const accounts = new InMemoryAccountRepository();
    await accounts.insert(invitedEmployer());
    const useCase = new ActivateAccountUseCase(
      accounts,
      new InMemorySecretHasher(),
    );

    await expect(
      useCase.execute({ invitationToken: 'invite-1', secret: '   ' }),
    ).rejects.toThrow(ErrorCode.REQUIRED_INFORMATION);
    expect(
      (await accounts.listByCompany('company-1'))[0]?.status,
    ).toBe(AccountStatus.INVITED);
  });
});
