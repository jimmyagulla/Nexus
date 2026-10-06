import { Company } from '../entities/company';
import { ErrorCode } from '../errors/error-code';
import { CompanyName } from '../value-objects/company-name';
import { requireAccessibleCompany } from './require-accessible-company';

const acme = Company.create('c1', CompanyName.parse('Acme'));

function companyStore(companies: readonly Company[]) {
  const queriedIds: string[] = [];

  return {
    queriedIds,
    findById: async (id: string): Promise<Company | null> => {
      queriedIds.push(id);
      return companies.find((company) => company.id === id) ?? null;
    },
  };
}

function unreachableStore(failure: Error) {
  return {
    findById: async (): Promise<Company | null> => {
      throw failure;
    },
  };
}

describe('requireAccessibleCompany', () => {
  it('hands back the company the actor belongs to', async () => {
    const store = companyStore([acme]);

    await expect(
      requireAccessibleCompany('c1', 'c1', store.findById),
    ).resolves.toBe(acme);
  });

  it('looks the company up by its identifier', async () => {
    const store = companyStore([acme]);

    await requireAccessibleCompany('c1', 'c1', store.findById);

    expect(store.queriedIds).toEqual(['c1']);
  });

  it('refuses a company owned by another tenant', async () => {
    const store = companyStore([acme]);

    await expect(
      requireAccessibleCompany('c1', 'c2', store.findById),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses an actor not bound to a company', async () => {
    const store = companyStore([acme]);

    await expect(
      requireAccessibleCompany('c1', null, store.findById),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('never reads the store for a company outside the tenant of the actor', async () => {
    const store = companyStore([acme]);

    await expect(
      requireAccessibleCompany('c1', 'c2', store.findById),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    expect(store.queriedIds).toEqual([]);
  });

  it('refuses a company the store does not know, as an access denial', async () => {
    const store = companyStore([]);

    await expect(
      requireAccessibleCompany('c1', 'c1', store.findById),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('propagates a store failure', async () => {
    const store = unreachableStore(new Error('store unreachable'));

    await expect(
      requireAccessibleCompany('c1', 'c1', store.findById),
    ).rejects.toThrow('store unreachable');
  });
});
