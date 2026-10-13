import { InMemoryAccountRepository } from '@hexagonal-monorepo-template/adapters';
import {
  Account,
  AccountIdentifier,
  AccountStatus,
  ActorContext,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { InviteEmployerUseCase } from './invite-employer.use-case';

const employer: ActorContext = {
  userId: 'founder',
  companyId: 'company-1',
  role: UserRole.EMPLOYER,
};

describe('InviteEmployerUseCase', () => {
  it('creates an invited employer account in the company of the inviter', async () => {
    const accounts = new InMemoryAccountRepository();

    const invited = await new InviteEmployerUseCase(accounts).execute({
      actor: employer,
      identifier: 'colleague',
    });

    expect(invited).toMatchObject({
      identifier: 'colleague',
      role: UserRole.EMPLOYER,
      status: AccountStatus.INVITED,
    });
    expect(await accounts.listByCompany('company-1')).toHaveLength(1);
    expect(await accounts.listByCompany('company-2')).toEqual([]);
  });

  it('hands over an activation means that opens the same company', async () => {
    const accounts = new InMemoryAccountRepository();

    const invited = await new InviteEmployerUseCase(accounts).execute({
      actor: employer,
      identifier: 'colleague',
    });

    const account = await accounts.findByInvitationToken(
      invited.invitationToken,
    );
    expect(account?.companyId).toBe('company-1');
    expect(account?.activate('hash').status).toBe(AccountStatus.ACTIVE);
  });

  it('never stores a secret for the invited account', async () => {
    const accounts = new InMemoryAccountRepository();

    await new InviteEmployerUseCase(accounts).execute({
      actor: employer,
      identifier: 'colleague',
    });

    expect((await accounts.findByIdentifier('colleague'))?.secretHash).toBeNull();
  });

  it.each([UserRole.EMPLOYEE, UserRole.ACCOUNTANT])(
    'refuses an inviter with the role %s',
    async (role) => {
      const accounts = new InMemoryAccountRepository();

      await expect(
        new InviteEmployerUseCase(accounts).execute({
          actor: { ...employer, role },
          identifier: 'colleague',
        }),
      ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
      expect(await accounts.listByCompany('company-1')).toEqual([]);
    },
  );

  it('refuses an identifier that already exists', async () => {
    const accounts = new InMemoryAccountRepository();
    await accounts.insert(
      Account.inviteEmployer(
        'account-1',
        'company-1',
        AccountIdentifier.parse('colleague'),
        'invite-1',
      ),
    );

    await expect(
      new InviteEmployerUseCase(accounts).execute({
        actor: employer,
        identifier: '  colleague ',
      }),
    ).rejects.toThrow(ErrorCode.POTENTIAL_DUPLICATE);
    expect(await accounts.listByCompany('company-1')).toHaveLength(1);
  });

  it('refuses a blank identifier', async () => {
    const accounts = new InMemoryAccountRepository();

    await expect(
      new InviteEmployerUseCase(accounts).execute({
        actor: employer,
        identifier: '   ',
      }),
    ).rejects.toThrow(ErrorCode.REQUIRED_INFORMATION);
    expect(await accounts.listByCompany('company-1')).toEqual([]);
  });
});
