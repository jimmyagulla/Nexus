import { describe, expect, it } from 'vitest';
import { Company, CompanyName } from '@hexagonal-monorepo-template/domain';
import { InMemoryCompanyRepository } from './in-memory-company.repository';

describe('InMemoryCompanyRepository', () => {
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
