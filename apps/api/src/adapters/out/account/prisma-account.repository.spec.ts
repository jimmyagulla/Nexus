import { describe, expect, it } from 'vitest';
import {
  Account,
  AccountIdentifier,
  AccountStatus,
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
      },
      findMany: async (args: {
        where: { companyId: string };
      }): Promise<AccountRow[]> =>
        rows.filter((row) => row.companyId === args.where.companyId),
      findUnique: async (args: {
        where: { invitationToken?: string };
      }): Promise<AccountRow | null> =>
        rows.find(
          (row) => row.invitationToken === args.where.invitationToken,
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
      },
    ]);
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
