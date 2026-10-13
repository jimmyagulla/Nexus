import {
  InMemoryAccountRepository,
  InMemorySecondFactorEnrollmentRepository,
  InMemorySecretHasher,
  TotpSecondFactorCodes,
  UuidGenerator,
} from '@hexagonal-monorepo-template/adapters';
import {
  Account,
  AccountIdentifier,
  AccountStatus,
  ErrorCode,
  SecondFactorEnrollmentStatus,
} from '@hexagonal-monorepo-template/domain';
import { ActivateEmployeeAccountUseCase } from './activate-employee-account.use-case';

const employeeInvitation = Account.inviteEmployee(
  'account-1',
  'c1',
  AccountIdentifier.parse('alice'),
  'invite-1',
  'e1',
);

const otherEmployeeInvitation = Account.inviteEmployee(
  'account-3',
  'c1',
  AccountIdentifier.parse('bruno'),
  'invite-3',
  'e2',
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
  const enrollments = new InMemorySecondFactorEnrollmentRepository();
  return {
    repository,
    secrets,
    enrollments,
    useCase: new ActivateEmployeeAccountUseCase(
      repository,
      secrets,
      enrollments,
      new TotpSecondFactorCodes(),
      new UuidGenerator(),
    ),
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

  describe('chaining the second factor enrollment', () => {
    it('offers the enrollment as soon as the secret is chosen', async () => {
      const { enrollments, useCase } = await setup();

      const offer = await useCase.execute({
        invitationToken: 'invite-1',
        secret: 'my-secret',
      });

      const stored = await enrollments.findById(offer.enrollmentId);
      expect(stored?.accountId).toBe('account-1');
      expect(stored?.status).toBe(SecondFactorEnrollmentStatus.PENDING);
      expect(stored?.secret).toBe(offer.secret);
    });

    it('describes the enrollment for the account of the employee', async () => {
      const { useCase } = await setup();

      const offer = await useCase.execute({
        invitationToken: 'invite-1',
        secret: 'my-secret',
      });

      expect(offer.provisioningUri).toBe(
        `otpauth://totp/Nexus:alice?secret=${offer.secret}&issuer=Nexus`,
      );
    });

    it('does not carry the chosen secret in the offer', async () => {
      const { useCase } = await setup();

      const offer = await useCase.execute({
        invitationToken: 'invite-1',
        secret: 'my-secret',
      });

      expect(JSON.stringify(offer)).not.toContain('my-secret');
    });

    it('gives each employee their own enrollment', async () => {
      const { useCase } = await setup([
        employeeInvitation,
        otherEmployeeInvitation,
      ]);

      const first = await useCase.execute({
        invitationToken: 'invite-1',
        secret: 'my-secret',
      });
      const second = await useCase.execute({
        invitationToken: 'invite-3',
        secret: 'my-secret',
      });

      expect(first.enrollmentId).not.toBe(second.enrollmentId);
      expect(first.secret).not.toBe(second.secret);
    });

    it('starts no enrollment for an invitation that cannot be used', async () => {
      const { enrollments, useCase } = await setup([employerInvitation]);

      await useCase
        .execute({ invitationToken: 'invite-2', secret: 'my-secret' })
        .catch(() => undefined);
      await useCase
        .execute({ invitationToken: 'unknown', secret: 'my-secret' })
        .catch(() => undefined);

      expect(await enrollments.findByAccountId('account-2')).toBeNull();
    });

    it('starts no enrollment when the secret is refused', async () => {
      const { enrollments, useCase } = await setup();

      await useCase
        .execute({ invitationToken: 'invite-1', secret: '   ' })
        .catch(() => undefined);

      expect(await enrollments.findByAccountId('account-1')).toBeNull();
    });
  });
});
