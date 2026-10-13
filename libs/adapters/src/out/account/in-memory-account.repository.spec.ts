import {
  Account,
  AccountIdentifier,
} from '@hexagonal-monorepo-template/domain';
import { InMemoryAccountRepository } from './in-memory-account.repository';

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

function invitedEmployee(
  id: string,
  companyId: string,
  identifier: string,
  employeeId: string,
): Account {
  return Account.inviteEmployee(
    id,
    companyId,
    AccountIdentifier.parse(identifier),
    `invite-${id}`,
    employeeId,
  );
}

describe('InMemoryAccountRepository', () => {
  it('lists an inserted account back under its company', async () => {
    const accounts = new InMemoryAccountRepository();
    const account = invitedEmployer('a1', 'c1', 'founder');

    await accounts.insert(account);

    expect(await accounts.listByCompany('c1')).toEqual([account]);
  });

  it('lists every account of the same company', async () => {
    const accounts = new InMemoryAccountRepository();
    const first = invitedEmployer('a1', 'c1', 'founder');
    const second = invitedEmployer('a2', 'c1', 'partner');

    await accounts.insert(first);
    await accounts.insert(second);

    expect(await accounts.listByCompany('c1')).toEqual([first, second]);
  });

  it('lists nothing from an empty store', async () => {
    const accounts = new InMemoryAccountRepository();

    expect(await accounts.listByCompany('c1')).toEqual([]);
  });

  it('lists nothing for a company that carries no account', async () => {
    const accounts = new InMemoryAccountRepository();

    await accounts.insert(invitedEmployer('a1', 'c1', 'founder'));

    expect(await accounts.listByCompany('c2')).toEqual([]);
  });

  it('keeps the accounts of two companies apart', async () => {
    const accounts = new InMemoryAccountRepository();
    const ofFirst = invitedEmployer('a1', 'c1', 'founder');
    const ofSecond = invitedEmployer('a2', 'c2', 'founder');

    await accounts.insert(ofFirst);
    await accounts.insert(ofSecond);

    expect(await accounts.listByCompany('c1')).toEqual([ofFirst]);
    expect(await accounts.listByCompany('c2')).toEqual([ofSecond]);
  });

  it('lists the accounts seeded through the injected collection', async () => {
    const seeded = invitedEmployer('a1', 'c1', 'founder');
    const accounts = new InMemoryAccountRepository(new Map([['a1', seeded]]));

    expect(await accounts.listByCompany('c1')).toEqual([seeded]);
  });

  it('reads the account back by its invitation token', async () => {
    const accounts = new InMemoryAccountRepository();
    const account = invitedEmployer('a1', 'c1', 'founder');

    await accounts.insert(account);

    expect(await accounts.findByInvitationToken('invite-a1')).toEqual(account);
  });

  it('returns nothing for an unknown invitation token', async () => {
    const accounts = new InMemoryAccountRepository();

    await accounts.insert(invitedEmployer('a1', 'c1', 'founder'));

    expect(await accounts.findByInvitationToken('missing')).toBeNull();
  });

  it('reads the account back by its identifier', async () => {
    const accounts = new InMemoryAccountRepository();
    const account = invitedEmployer('a1', 'c1', 'founder');

    await accounts.insert(account);

    expect(await accounts.findByIdentifier('founder')).toEqual(account);
  });

  it('returns nothing for an unknown identifier', async () => {
    const accounts = new InMemoryAccountRepository();

    await accounts.insert(invitedEmployer('a1', 'c1', 'founder'));

    expect(await accounts.findByIdentifier('missing')).toBeNull();
  });

  it('saves the activated account over the invited one', async () => {
    const accounts = new InMemoryAccountRepository();
    const invited = invitedEmployer('a1', 'c1', 'founder');

    await accounts.insert(invited);
    const activated = invited.activate('hashed-secret');
    await accounts.save(activated);

    expect(await accounts.listByCompany('c1')).toEqual([activated]);
    expect(await accounts.findByInvitationToken('invite-a1')).toBeNull();
  });

  it('reads the account back by its id', async () => {
    const accounts = new InMemoryAccountRepository();
    const account = invitedEmployer('a1', 'c1', 'founder');

    await accounts.insert(invitedEmployer('a0', 'c1', 'partner'));
    await accounts.insert(account);

    expect(await accounts.findById('a1')).toEqual(account);
  });

  it('returns nothing for an unknown account id', async () => {
    const accounts = new InMemoryAccountRepository();

    await accounts.insert(invitedEmployer('a1', 'c1', 'founder'));

    expect(await accounts.findById('missing')).toBeNull();
  });

  it('reads the account of an employee record back by that record', async () => {
    const accounts = new InMemoryAccountRepository();
    const account = invitedEmployee('a2', 'c1', 'alice', 'e1');

    await accounts.insert(invitedEmployer('a1', 'c1', 'founder'));
    await accounts.insert(account);

    expect(await accounts.findByEmployeeId('e1')).toEqual(account);
  });

  it('returns nothing for an employee record without account', async () => {
    const accounts = new InMemoryAccountRepository();

    await accounts.insert(invitedEmployee('a2', 'c1', 'alice', 'e1'));

    expect(await accounts.findByEmployeeId('e2')).toBeNull();
  });

  it('does not take an employer account for the account of a record', async () => {
    const accounts = new InMemoryAccountRepository();

    await accounts.insert(invitedEmployer('a1', 'c1', 'founder'));

    expect(await accounts.findByEmployeeId('a1')).toBeNull();
  });
});
