import { describe, expect, it } from 'vitest';
import { Company, CompanyName } from '@hexagonal-monorepo-template/domain';
import { InMemoryCompanyRepository } from './in-memory-company.repository';

const ASSIGNED_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe('InMemoryCompanyRepository', () => {
  it('assigns an id when inserting a company', async () => {
    const companies = new InMemoryCompanyRepository();

    const company = await companies.insert(CompanyName.parse('Acme'));

    expect(company.id).toMatch(ASSIGNED_ID);
    expect(company.name.value).toBe('Acme');
    expect(await companies.findById(company.id)).toEqual(company);
  });

  it('assigns a different id to each inserted company', async () => {
    const companies = new InMemoryCompanyRepository();

    const first = await companies.insert(CompanyName.parse('Acme'));
    const second = await companies.insert(CompanyName.parse('Globex'));

    expect(first.id).not.toBe(second.id);
    expect(await companies.findById(first.id)).toEqual(first);
    expect(await companies.findById(second.id)).toEqual(second);
  });

  it('saves and finds a company by id', async () => {
    const companies = new InMemoryCompanyRepository();
    const company = Company.create('c1', CompanyName.parse('Acme'));

    await companies.save(company);

    expect(await companies.findById('c1')).toEqual(company);
    expect(await companies.findById('missing')).toBeNull();
  });

  it('finds nothing in an empty collection', async () => {
    const companies = new InMemoryCompanyRepository();

    expect(await companies.findById('c1')).toBeNull();
  });

  it('replaces a company saved again under the same id', async () => {
    const companies = new InMemoryCompanyRepository();
    const company = Company.create('c1', CompanyName.parse('Acme'));
    const renamed = company.rename(CompanyName.parse('Acme Corp'));

    await companies.save(company);
    await companies.save(renamed);

    expect(await companies.findById('c1')).toEqual(renamed);
  });

  it('keeps two companies apart', async () => {
    const companies = new InMemoryCompanyRepository();
    const first = Company.create('c1', CompanyName.parse('Acme'));
    const second = Company.create('c2', CompanyName.parse('Globex'));

    await companies.save(first);
    await companies.save(second);

    expect(await companies.findById('c1')).toEqual(first);
    expect(await companies.findById('c2')).toEqual(second);
  });

  it('reads the companies seeded through the injected collection', async () => {
    const company = Company.create('c1', CompanyName.parse('Acme'));
    const companies = new InMemoryCompanyRepository(new Map([['c1', company]]));

    expect(await companies.findById('c1')).toEqual(company);
  });

  it('keeps two collections independent', async () => {
    const companies = new InMemoryCompanyRepository();
    const other = new InMemoryCompanyRepository();

    await companies.save(Company.create('c1', CompanyName.parse('Acme')));

    expect(await other.findById('c1')).toBeNull();
  });
});
