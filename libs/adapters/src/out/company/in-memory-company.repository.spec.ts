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
});
