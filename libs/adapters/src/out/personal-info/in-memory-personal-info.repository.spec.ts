import { describe, expect, it } from 'vitest';
import {
  CalendarDate,
  EmploymentContractType,
  PersonalContact,
  PersonalInfo,
  WorkingTime,
} from '@hexagonal-monorepo-template/domain';
import { InMemoryPersonalInfoRepository } from './in-memory-personal-info.repository';

function infoOf(companyId: string, employeeId: string, address = '14 rue des Tilleuls'): PersonalInfo {
  return new PersonalInfo({
    companyId, employeeId,
    contact: PersonalContact.parse({ address, postalCodeAndCity: '34000 Montpellier', phone: '06 12 34 56 47', email: 'camille.martin@mail.fr' }),
    employment: {
      lastName: 'Martin', firstName: 'Camille', birthDate: CalendarDate.parse('1992-05-18'), socialSecurityNumber: '292057512345641',
      jobTitle: 'Chargée de clientèle', department: 'Commercial', contractType: EmploymentContractType.PERMANENT,
      workingTime: WorkingTime.FULL_TIME, startDate: CalendarDate.parse('2021-03-02'), iban: 'FR7630006000011234567890189',
    },
    updatedAt: new Date('2026-06-12T08:00:00.000Z'),
  });
}

describe('InMemoryPersonalInfoRepository', () => {
  it('finds the information of an employee in their company only', async () => {
    const repository = new InMemoryPersonalInfoRepository([infoOf('c1', 'u1')]);

    await expect(repository.findByEmployee({ companyId: 'c1', ownerId: 'u1' })).resolves.toMatchObject({ employeeId: 'u1' });
    await expect(repository.findByEmployee({ companyId: 'c2', ownerId: 'u1' })).resolves.toBeNull();
    await expect(repository.findByEmployee({ companyId: 'c1', ownerId: 'u2' })).resolves.toBeNull();
  });

  it('keeps the saved version', async () => {
    const repository = new InMemoryPersonalInfoRepository([infoOf('c1', 'u1')]);

    await repository.save(infoOf('c1', 'u1', '8 avenue de Lodève'));

    const found = await repository.findByEmployee({ companyId: 'c1', ownerId: 'u1' });
    expect(found?.contact.address).toBe('8 avenue de Lodève');
  });
});
