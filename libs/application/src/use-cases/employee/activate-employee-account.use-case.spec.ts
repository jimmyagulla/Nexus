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
import { ActivateEmployeeAccountUseCase } from './activate-employee-account.use-case';

const employeeInvitation = Account.inviteEmployee(
  'account-1',
  'c1',
  AccountIdentifier.parse('alice'),
  'invite-1',
  'e1',
);

const employerInvitation = Account.inviteEmployer(
  'account-2',
  'c1',
  AccountIdentifier.parse('founder'),
  'invite-2',
);

async function setup(accounts: readonly Account[] = [employeeInvitation]) {
  const repository = new InMemoryAccountRepository();
  for (const account of accounts) {
    await repository.insert(account);
  }
  const secrets = new InMemorySecretHasher();
  return {
    repository,
    secrets,
    useCase: new ActivateEmployeeAccountUseCase(repository, secrets),
  };
}

describe('ActivateEmployeeAccountUseCase', () => {
  it('opens the account with the secret the employee chose', async () => {
    const { repository, secrets, useCase } = await setup();

    await useCase.execute({
      invitationToken: 'invite-1',
      secret: 'my-secret',
    });

    const account = await repository.findByEmployeeId('e1');
    expect(account?.status).toBe(AccountStatus.ACTIVE);
    expect(account?.invitationToken).toBeNull();
    expect(
      await secrets.matches('my-secret', account?.secretHash ?? ''),
    ).toBe(true);
    expect(
      await secrets.matches('another-secret', account?.secretHash ?? ''),
    ).toBe(false);
  });

  it('answers an invalid invitation for a token nobody holds', async () => {
    const { useCase } = await setup();

    await expect(
      useCase.execute({ invitationToken: 'unknown', secret: 'my-secret' }),
    ).rejects.toThrow(ErrorCode.INVITATION_INVALID);
  });

  it('answers an invalid invitation for a missing token', async () => {
    const { useCase } = await setup();

    await expect(
      useCase.execute({ invitationToken: '   ', secret: 'my-secret' }),
    ).rejects.toThrow(ErrorCode.INVITATION_INVALID);
  });

  it('answers an invalid invitation once the invitation is consumed', async () => {
    const { useCase } = await setup();
    await useCase.execute({ invitationToken: 'invite-1', secret: 'my-secret' });

    await expect(
      useCase.execute({ invitationToken: 'invite-1', secret: 'other-secret' }),
    ).rejects.toThrow(ErrorCode.INVITATION_INVALID);
  });

  it('keeps the first secret when a second person replays the invitation', async () => {
    const { repository, secrets, useCase } = await setup();
    await useCase.execute({ invitationToken: 'invite-1', secret: 'my-secret' });

    await useCase
      .execute({ invitationToken: 'invite-1', secret: 'intruder-secret' })
      .catch(() => undefined);

    const account = await repository.findByEmployeeId('e1');
    expect(await secrets.matches('my-secret', account?.secretHash ?? '')).toBe(
      true,
    );
  });

  it('does not consume an employer invitation', async () => {
    const { repository, useCase } = await setup([employerInvitation]);

    await expect(
      useCase.execute({ invitationToken: 'invite-2', secret: 'my-secret' }),
    ).rejects.toThrow(ErrorCode.INVITATION_INVALID);
    expect(
      (await repository.findByInvitationToken('invite-2'))?.status,
    ).toBe(AccountStatus.INVITED);
  });

  it('refuses an empty secret and leaves the invitation usable', async () => {
    const { repository, useCase } = await setup();

    await expect(
      useCase.execute({ invitationToken: 'invite-1', secret: '   ' }),
    ).rejects.toThrow(ErrorCode.REQUIRED_INFORMATION);
    expect(
      (await repository.findByInvitationToken('invite-1'))?.status,
    ).toBe(AccountStatus.INVITED);
  });
});
