import { describe, expect, it } from 'vitest';
import {
  Account,
  AccountIdentifier,
  AccountStatus,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import { PrismaAccountRepository } from './prisma-account.repository';

type AccountRow = {
  id: string;
  companyId: string;
  identifier: string;
  role: UserRole;
  status: AccountStatus;
  invitationToken: string | null;
  secretHash: string | null;
  failedSignInCount: number;
  employeeId: string | null;
};

type AccountCreateData = AccountRow;

type FakePrisma = {
  client: PrismaDb;
  rows: AccountRow[];
  creates: AccountCreateData[];
};

function createFakePrisma(seed: AccountRow[] = []): FakePrisma {
  const rows = [...seed];
  const creates: AccountCreateData[] = [];

  const client = {
    account: {
      create: async (args: { data: AccountCreateData }): Promise<void> => {
        creates.push(args.data);
        rows.push({ ...args.data });
      },
      update: async (args: {
        where: { id: string };
        data: Omit<AccountRow, 'id'>;
      }): Promise<void> => {
        const stored = rows.find((row) => row.id === args.where.id);
        if (stored === undefined) {
          return;
        }
        stored.companyId = args.data.companyId;
        stored.identifier = args.data.identifier;
        stored.role = args.data.role;
        stored.status = args.data.status;
        stored.invitationToken = args.data.invitationToken;
        stored.secretHash = args.data.secretHash;
        stored.failedSignInCount = args.data.failedSignInCount;
        stored.employeeId = args.data.employeeId;
      },
      updateMany: async (args: {
        where: { id: string; invitationToken: string };
        data: Omit<AccountRow, 'id'>;
      }): Promise<{ count: number }> => {
        const stored = rows.find(
          (row) =>
            row.id === args.where.id &&
            row.invitationToken === args.where.invitationToken,
        );
        if (stored === undefined) {
          return { count: 0 };
        }
        Object.assign(stored, args.data);
        return { count: 1 };
      },
      findMany: async (args: {
        where: { companyId: string };
      }): Promise<AccountRow[]> =>
        rows.filter((row) => row.companyId === args.where.companyId),
      findUnique: async (args: {
        where: { invitationToken?: string; id?: string };
      }): Promise<AccountRow | null> =>
        rows.find((row) =>
          args.where.id !== undefined
            ? row.id === args.where.id
            : row.invitationToken === args.where.invitationToken,
        ) ?? null,
      findFirst: async (args: {
        where: { identifier?: string; employeeId?: string };
      }): Promise<AccountRow | null> =>
        rows.find(
          (row) =>
            (args.where.identifier === undefined ||
              row.identifier === args.where.identifier) &&
            (args.where.employeeId === undefined ||
              row.employeeId === args.where.employeeId),
        ) ?? null,
    },
  };

  return { client: client as unknown as PrismaDb, rows, creates };
}

function invitedEmployer(
  id: string,
  companyId: string,
  identifier: string,
): Account {
  return Account.inviteEmployer(
    id,
    companyId,
    AccountIdentifier.parse(identifier),
    `invite-${id}`,
  );
}

describe('PrismaAccountRepository', () => {
  it('reads back the account it has just inserted', async () => {
    const { client } = createFakePrisma();
    const repository = new PrismaAccountRepository(client);
    const account = invitedEmployer('account-1', 'company-1', 'founder');

    await repository.insert(account);

    expect(await repository.listByCompany('company-1')).toEqual([account]);
  });

  it('stores the invited employer fields', async () => {
    const { client, creates } = createFakePrisma();
    const account = invitedEmployer('account-1', 'company-1', 'founder');

    await new PrismaAccountRepository(client).insert(account);

    expect(creates).toEqual([
      {
        id: 'account-1',
        companyId: 'company-1',
        identifier: 'founder',
        role: UserRole.EMPLOYER,
        status: AccountStatus.INVITED,
        invitationToken: 'invite-account-1',
        secretHash: null,
        failedSignInCount: 0,
        employeeId: null,
      },
    ]);
  });

  it('stores the employee record an invited employee account is bound to', async () => {
    const { client, creates } = createFakePrisma();
    const account = Account.inviteEmployee(
      'account-2',
      'company-1',
      AccountIdentifier.parse('alice'),
      'invite-2',
      'employee-1',
    );

    await new PrismaAccountRepository(client).insert(account);

    expect(creates).toEqual([
      {
        id: 'account-2',
        companyId: 'company-1',
        identifier: 'alice',
        role: UserRole.EMPLOYEE,
        status: AccountStatus.INVITED,
        invitationToken: 'invite-2',
        secretHash: null,
        failedSignInCount: 0,
        employeeId: 'employee-1',
      },
    ]);
  });

  describe('consuming an invitation', () => {
    function invitedEmployee(): Account {
      return Account.inviteEmployee(
        'account-2',
        'company-1',
        AccountIdentifier.parse('alice'),
        'invite-2',
        'employee-1',
      );
    }

    it('stores the activated account when the invitation is still there', async () => {
      const { client } = createFakePrisma();
      const repository = new PrismaAccountRepository(client);
      const invited = invitedEmployee();
      await repository.insert(invited);
      const activated = invited.activate('hashed-secret');

      await repository.consumeInvitation(activated, 'invite-2');

      expect(await repository.findById('account-2')).toEqual(activated);
      expect(await repository.findByInvitationToken('invite-2')).toBeNull();
    });

    it('refuses a second consumption of the same invitation, keeping the first secret', async () => {
      const { client } = createFakePrisma();
      const repository = new PrismaAccountRepository(client);
      const invited = invitedEmployee();
      await repository.insert(invited);
      const first = invited.activate('first-secret');
      await repository.consumeInvitation(first, 'invite-2');

      await expect(
        repository.consumeInvitation(invited.activate('second-secret'), 'invite-2'),
      ).rejects.toThrow(ErrorCode.INVITATION_INVALID);

      expect(await repository.findById('account-2')).toEqual(first);
    });

    it('refuses an account the store does not know', async () => {
      const { client } = createFakePrisma();

      await expect(
        new PrismaAccountRepository(client).consumeInvitation(
          invitedEmployee().activate('hashed-secret'),
          'invite-2',
        ),
      ).rejects.toThrow(ErrorCode.INVITATION_INVALID);
    });
  });

  it('reads the account back by its id', async () => {
    const { client } = createFakePrisma();
    const repository = new PrismaAccountRepository(client);
    const account = invitedEmployer('account-1', 'company-1', 'founder');

    await repository.insert(invitedEmployer('account-0', 'company-1', 'partner'));
    await repository.insert(account);

    expect(await repository.findById('account-1')).toEqual(account);
  });

  it('returns nothing for an unknown account id', async () => {
    const { client } = createFakePrisma();
    const repository = new PrismaAccountRepository(client);

    await repository.insert(invitedEmployer('account-1', 'company-1', 'founder'));

    expect(await repository.findById('missing')).toBeNull();
  });

  it('reads the account of an employee record back by that record', async () => {
    const { client } = createFakePrisma();
    const repository = new PrismaAccountRepository(client);
    const account = Account.inviteEmployee(
      'account-2',
      'company-1',
      AccountIdentifier.parse('alice'),
      'invite-2',
      'employee-1',
    );

    await repository.insert(invitedEmployer('account-1', 'company-1', 'founder'));
    await repository.insert(account);

    expect(await repository.findByEmployeeId('employee-1')).toEqual(account);
  });

  it('returns nothing for an employee record without account', async () => {
    const { client } = createFakePrisma();
    const repository = new PrismaAccountRepository(client);

    await repository.insert(invitedEmployer('account-1', 'company-1', 'founder'));

    expect(await repository.findByEmployeeId('employee-1')).toBeNull();
  });

  it('lists every account of the same company', async () => {
    const { client } = createFakePrisma();
    const repository = new PrismaAccountRepository(client);
    const first = invitedEmployer('a1', 'c1', 'founder');
    const second = invitedEmployer('a2', 'c1', 'partner');

    await repository.insert(first);
    await repository.insert(second);

    expect(await repository.listByCompany('c1')).toEqual([first, second]);
  });

  it('lists nothing from an empty store', async () => {
    const { client } = createFakePrisma();

    expect(
      await new PrismaAccountRepository(client).listByCompany('c1'),
    ).toEqual([]);
  });

  it('lists nothing for a company that carries no account', async () => {
    const { client } = createFakePrisma();
    const repository = new PrismaAccountRepository(client);

    await repository.insert(invitedEmployer('a1', 'c1', 'founder'));

    expect(await repository.listByCompany('c2')).toEqual([]);
  });

  it('keeps the accounts of two companies apart', async () => {
    const { client } = createFakePrisma();
    const repository = new PrismaAccountRepository(client);
    const ofFirst = invitedEmployer('a1', 'c1', 'founder');
    const ofSecond = invitedEmployer('a2', 'c2', 'founder');

    await repository.insert(ofFirst);
    await repository.insert(ofSecond);

    expect(await repository.listByCompany('c1')).toEqual([ofFirst]);
    expect(await repository.listByCompany('c2')).toEqual([ofSecond]);
  });

  it('reads the account back by its invitation token', async () => {
    const { client } = createFakePrisma();
    const repository = new PrismaAccountRepository(client);
    const account = invitedEmployer('account-1', 'company-1', 'founder');

    await repository.insert(account);

    expect(await repository.findByInvitationToken('invite-account-1')).toEqual(
      account,
    );
  });

  it('returns nothing for an unknown invitation token', async () => {
    const { client } = createFakePrisma();
    const repository = new PrismaAccountRepository(client);

    await repository.insert(invitedEmployer('account-1', 'company-1', 'founder'));

    expect(await repository.findByInvitationToken('missing')).toBeNull();
  });

  it('reads the account back by its identifier', async () => {
    const { client } = createFakePrisma();
    const repository = new PrismaAccountRepository(client);
    const account = invitedEmployer('account-1', 'company-1', 'founder');

    await repository.insert(account);

    expect(await repository.findByIdentifier('founder')).toEqual(account);
  });

  it('returns nothing for an unknown identifier', async () => {
    const { client } = createFakePrisma();
    const repository = new PrismaAccountRepository(client);

    await repository.insert(invitedEmployer('account-1', 'company-1', 'founder'));

    expect(await repository.findByIdentifier('missing')).toBeNull();
  });

  it('saves the activated account over the invited one', async () => {
    const { client } = createFakePrisma();
    const repository = new PrismaAccountRepository(client);
    const invited = invitedEmployer('account-1', 'company-1', 'founder');

    await repository.insert(invited);
    const activated = invited.activate('hashed-secret');
    await repository.save(activated);

    expect(await repository.listByCompany('company-1')).toEqual([activated]);
    expect(await repository.findByInvitationToken('invite-account-1')).toBeNull();
  });
});
