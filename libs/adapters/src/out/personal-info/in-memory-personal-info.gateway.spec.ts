import { describe, expect, it } from 'vitest';
import {
  CalendarDate,
  EmploymentContractType,
  ErrorCode,
  PersonalContact,
  PersonalInfo,
  UserRole,
  WorkingTime,
} from '@hexagonal-monorepo-template/domain';
import { FixedClock } from '../clock/fixed-clock';
import { InMemoryPersonalInfoGateway } from './in-memory-personal-info.gateway';

const contact = { address: '14 rue des Tilleuls', postalCodeAndCity: '34000 Montpellier', phone: '06 12 34 56 47', email: 'camille.martin@mail.fr' };
const now = new Date('2026-10-03T08:41:00.000Z');

function gateway(): InMemoryPersonalInfoGateway {
  const info = new PersonalInfo({
    companyId: 'c1', employeeId: 'u1', contact: PersonalContact.parse(contact),
    employment: {
      lastName: 'Martin', firstName: 'Camille', birthDate: CalendarDate.parse('1992-05-18'), socialSecurityNumber: '292057512345641',
      jobTitle: 'Chargée de clientèle', department: 'Commercial', contractType: EmploymentContractType.PERMANENT,
      workingTime: WorkingTime.FULL_TIME, startDate: CalendarDate.parse('2021-03-02'), iban: 'FR7630006000011234567890189',
    },
    updatedAt: new Date('2026-06-12T08:00:00.000Z'),
  });
  return new InMemoryPersonalInfoGateway([info], new FixedClock(now), new Map([['hr1', UserRole.EMPLOYER]]));
}

describe('InMemoryPersonalInfoGateway', () => {
  it('hands the employee and their employer the information, sensitive numbers masked', async () => {
    const personalInfos = gateway();

    await expect(personalInfos.get('c1', 'u1', 'u1')).resolves.toMatchObject({ employeeId: 'u1', contact, employment: { iban: 'FR76 •••• •••• •••• •••• •••• 189' } });
    await expect(personalInfos.get('c1', 'u1', 'hr1')).resolves.toMatchObject({ employeeId: 'u1' });
  });

  it('refuses a colleague', async () => {
    await expect(gateway().get('c1', 'u1', 'u2')).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('keeps the new contact details of the employee, dated now', async () => {
    const personalInfos = gateway();

    await personalInfos.updateContact('c1', 'u1', { ...contact, phone: '07 00 00 00 00' }, 'u1');

    await expect(personalInfos.get('c1', 'u1', 'u1')).resolves.toMatchObject({
      contact: { phone: '07 00 00 00 00' },
      updatedAt: now.toISOString(),
    });
  });

  it('refuses the employer the change, and invalid details', async () => {
    const personalInfos = gateway();

    await expect(personalInfos.updateContact('c1', 'u1', contact, 'hr1')).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    await expect(personalInfos.updateContact('c1', 'u1', { ...contact, email: 'nope' }, 'u1')).rejects.toThrow(ErrorCode.INVALID_INFORMATION);
  });
});
