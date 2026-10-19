import { ErrorCode } from '../errors/error-code';
import { UserRole } from '../identity/user-role';
import { toPersonalInfoSnapshot } from '../read-models/personal-info-snapshot';
import {
  requireEditablePersonalInfo,
  requireReadablePersonalInfo,
} from '../services/require-personal-info-access';
import { CalendarDate } from '../value-objects/calendar-date';
import { EmploymentContractType, WorkingTime } from '../value-objects/employment-contract';
import { PersonalContact } from '../value-objects/personal-contact';
import { PersonalInfo } from './personal-info';

const contact = PersonalContact.parse({
  address: '14 rue des Tilleuls',
  postalCodeAndCity: '34000 Montpellier',
  phone: '06 12 34 56 47',
  email: 'camille.martin@mail.fr',
});

const info = new PersonalInfo({
  companyId: 'c1',
  employeeId: 'u1',
  contact,
  employment: {
    lastName: 'Martin',
    firstName: 'Camille',
    birthDate: CalendarDate.parse('1992-05-18'),
    socialSecurityNumber: '292057512345641',
    jobTitle: 'Chargée de clientèle',
    department: 'Commercial',
    contractType: EmploymentContractType.PERMANENT,
    workingTime: WorkingTime.FULL_TIME,
    startDate: CalendarDate.parse('2021-03-02'),
    iban: 'FR7630006000011234567890189',
  },
  updatedAt: new Date('2026-06-12T08:00:00.000Z'),
});

const self = { userId: 'u1', companyId: 'c1', role: UserRole.EMPLOYEE };
const employer = { userId: 'hr1', companyId: 'c1', role: UserRole.EMPLOYER };
const colleague = { userId: 'u2', companyId: 'c1', role: UserRole.EMPLOYEE };
const otherEmployer = { userId: 'hr2', companyId: 'c2', role: UserRole.EMPLOYER };
const accountant = { userId: 'acc', companyId: 'c1', role: UserRole.ACCOUNTANT };

describe('PersonalInfo access', () => {
  it('lets the employee and an employer of their company read them', () => {
    expect(requireReadablePersonalInfo(info, self)).toBe(info);
    expect(requireReadablePersonalInfo(info, employer)).toBe(info);
  });

  it.each([
    ['a colleague', colleague],
    ['an employer of another company', otherEmployer],
    ['an accountant', accountant],
  ])('refuses the reading by %s', (_who, actor) => {
    expect(() => requireReadablePersonalInfo(info, actor)).toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses missing information like hidden ones', () => {
    expect(() => requireReadablePersonalInfo(null, self)).toThrow(ErrorCode.ACCESS_DENIED);
    expect(() => requireEditablePersonalInfo(null, self)).toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('lets only the employee change their contact details', () => {
    expect(requireEditablePersonalInfo(info, self)).toBe(info);
    expect(() => requireEditablePersonalInfo(info, employer)).toThrow(ErrorCode.ACCESS_DENIED);
    expect(() => requireEditablePersonalInfo(info, colleague)).toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses the employee once they belong to another company', () => {
    expect(() => requireEditablePersonalInfo(info, { ...self, companyId: 'c2' })).toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });
});

describe('PersonalInfo', () => {
  it('takes new contact details and the instant of the change', () => {
    const next = PersonalContact.parse({ ...contact.toValues(), address: '8 avenue de Lodève' });
    const at = new Date('2026-10-03T08:41:00.000Z');

    const updated = info.withContact(next, at);

    expect(updated.contact.address).toBe('8 avenue de Lodève');
    expect(updated.updatedAt).toBe(at);
    expect(updated.employment).toBe(info.employment);
  });

  it('leaves the API with the sensitive numbers masked', () => {
    expect(toPersonalInfoSnapshot(info)).toEqual({
      employeeId: 'u1',
      contact: contact.toValues(),
      employment: {
        lastName: 'Martin',
        firstName: 'Camille',
        birthDate: '1992-05-18',
        socialSecurityNumber: '2 92 05 •• ••• ••• 41',
        jobTitle: 'Chargée de clientèle',
        department: 'Commercial',
        contractType: 'PERMANENT',
        workingTime: 'FULL_TIME',
        startDate: '2021-03-02',
        iban: 'FR76 •••• •••• •••• •••• •••• 189',
      },
      updatedAt: '2026-06-12T08:00:00.000Z',
    });
  });
});
