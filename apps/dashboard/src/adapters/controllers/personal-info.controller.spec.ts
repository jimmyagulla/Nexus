import {
  FixedClock,
  InMemoryPersonalInfoGateway,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import {
  GetPersonalInfoFromSessionUseCase,
  UpdatePersonalContactFromSessionUseCase,
} from '@hexagonal-monorepo-template/application';
import {
  CalendarDate,
  EmploymentContractType,
  ErrorCode,
  PersonalContact,
  PersonalInfo,
  UserRole,
  WorkingTime,
} from '@hexagonal-monorepo-template/domain';
import { PersonalInfoController } from './personal-info.controller';

const contact = { address: '14 rue des Tilleuls', postalCodeAndCity: '34000 Montpellier', phone: '06 12 34 56 47', email: 'camille.martin@mail.fr' };

function controllerFor(userId: string): PersonalInfoController {
  const info = new PersonalInfo({
    companyId: 'c1', employeeId: 'u1', contact: PersonalContact.parse(contact),
    employment: {
      lastName: 'Martin', firstName: 'Camille', birthDate: CalendarDate.parse('1992-05-18'), socialSecurityNumber: '292057512345641',
      jobTitle: 'Chargée de clientèle', department: 'Commercial', contractType: EmploymentContractType.PERMANENT,
      workingTime: WorkingTime.FULL_TIME, startDate: CalendarDate.parse('2021-03-02'), iban: 'FR7630006000011234567890189',
    },
    updatedAt: new Date('2026-06-12T08:00:00.000Z'),
  });
  const sessions = new InMemorySessionGateway(userId, { userId, companyId: 'c1', role: UserRole.EMPLOYEE });
  const gateway = new InMemoryPersonalInfoGateway([info], new FixedClock(new Date('2026-10-03T08:41:00.000Z')));
  return new PersonalInfoController(
    new GetPersonalInfoFromSessionUseCase(sessions, gateway),
    new UpdatePersonalContactFromSessionUseCase(sessions, gateway),
  );
}

describe('PersonalInfoController', () => {
  it('loads the information of the signed-in employee', async () => {
    await expect(controllerFor('u1').loadPersonalInfo()).resolves.toMatchObject({ employeeId: 'u1', contact });
  });

  it('saves the confirmed contact details', async () => {
    const controller = controllerFor('u1');

    await expect(controller.updateContact({ ...contact, phone: '07 00 00 00 00' })).resolves.toMatchObject({
      contact: { phone: '07 00 00 00 00' },
      updatedAt: '2026-10-03T08:41:00.000Z',
    });
  });

  it('reaches no information but those of the signed-in employee', async () => {
    await expect(controllerFor('u2').loadPersonalInfo()).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
