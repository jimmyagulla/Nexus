import { describe, expect, it } from 'vitest';
import { PersonalContact } from '@hexagonal-monorepo-template/domain';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import { PrismaPersonalInfoRepository } from './prisma-personal-info.repository';
import type { PersonalInfo as PersonalInfoRecord } from '../../../infrastructure/prisma/prisma-client';

const row: PersonalInfoRecord = {
  companyId: 'c1', employeeId: 'u1', address: '14 rue des Tilleuls', postalCodeAndCity: '34000 Montpellier',
  phone: '06 12 34 56 47', email: 'camille.martin@mail.fr', lastName: 'Martin', firstName: 'Camille',
  birthDate: new Date('1992-05-18T00:00:00.000Z'), socialSecurityNumber: '292057512345641', jobTitle: 'Chargée de clientèle',
  department: 'Commercial', contractType: 'PERMANENT', workingTime: 'FULL_TIME', startDate: new Date('2021-03-02T00:00:00.000Z'),
  iban: 'FR7630006000011234567890189', updatedAt: new Date('2026-06-12T08:00:00.000Z'),
};

type Recorded = { findUnique: unknown[]; update: unknown[] };

function fakePrisma(): { client: PrismaDb; recorded: Recorded } {
  const recorded: Recorded = { findUnique: [], update: [] };
  const client = {
    personalInfo: {
      findUnique: async (args: { where: { companyId_employeeId: { employeeId: string } } }) => {
        recorded.findUnique.push(args);
        return args.where.companyId_employeeId.employeeId === 'u1' ? row : null;
      },
      update: async (args: unknown) => {
        recorded.update.push(args);
        return row;
      },
    },
  };
  return { client: client as unknown as PrismaDb, recorded };
}

describe('PrismaPersonalInfoRepository', () => {
  it('finds the information of an employee by company and employee', async () => {
    const { client, recorded } = fakePrisma();

    const info = await new PrismaPersonalInfoRepository(client).findByEmployee({ companyId: 'c1', ownerId: 'u1' });

    expect(info?.contact.toValues()).toEqual({
      address: '14 rue des Tilleuls', postalCodeAndCity: '34000 Montpellier', phone: '06 12 34 56 47', email: 'camille.martin@mail.fr',
    });
    expect(info?.employment.birthDate.value).toBe('1992-05-18');
    expect(info?.employment.startDate.value).toBe('2021-03-02');
    expect(recorded.findUnique).toEqual([{ where: { companyId_employeeId: { companyId: 'c1', employeeId: 'u1' } } }]);
  });

  it('finds nothing for an unknown employee', async () => {
    await expect(new PrismaPersonalInfoRepository(fakePrisma().client).findByEmployee({ companyId: 'c1', ownerId: 'u2' })).resolves.toBeNull();
  });

  it('writes the contact details and the instant of the change only', async () => {
    const { client, recorded } = fakePrisma();
    const repository = new PrismaPersonalInfoRepository(client);
    const info = await repository.findByEmployee({ companyId: 'c1', ownerId: 'u1' });
    if (info === null) {
      throw new Error('missing seed');
    }
    const at = new Date('2026-10-03T08:41:00.000Z');
    const contact = PersonalContact.parse({ ...info.contact.toValues(), address: '8 avenue de Lodève' });

    await repository.save(info.withContact(contact, at));

    expect(recorded.update).toEqual([{
      where: { companyId_employeeId: { companyId: 'c1', employeeId: 'u1' } },
      data: { address: '8 avenue de Lodève', postalCodeAndCity: '34000 Montpellier', phone: '06 12 34 56 47', email: 'camille.martin@mail.fr', updatedAt: at },
    }]);
  });
});
