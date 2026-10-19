import {
  FixedClock,
  InMemoryPersonalInfoGateway,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  CalendarDate,
  EmploymentContractType,
  ErrorCode,
  PersonalContact,
  PersonalInfo,
  UserRole,
  WorkingTime,
} from '@hexagonal-monorepo-template/domain';
import { GetPersonalInfoFromSessionUseCase } from './get-personal-info-from-session.use-case';
import { UpdatePersonalContactFromSessionUseCase } from './update-personal-contact-from-session.use-case';

const contact = { address: '14 rue des Tilleuls', postalCodeAndCity: '34000 Montpellier', phone: '06 12 34 56 47', email: 'camille.martin@mail.fr' };
const actor: ActorContext = { userId: 'u1', companyId: 'c1', role: UserRole.EMPLOYEE };

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
  return new InMemoryPersonalInfoGateway([info], new FixedClock(new Date('2026-10-03T08:41:00.000Z')));
}

describe('personal information from the session', () => {
  it('reads the information of the signed-in employee', async () => {
    const useCase = new GetPersonalInfoFromSessionUseCase(new InMemorySessionGateway('u1', actor), gateway());

    await expect(useCase.execute()).resolves.toMatchObject({ employeeId: 'u1', contact });
  });

  it('changes the contact details of the signed-in employee', async () => {
    const sessions = new InMemorySessionGateway('u1', actor);
    const personalInfos = gateway();

    await new UpdatePersonalContactFromSessionUseCase(sessions, personalInfos).execute({ ...contact, phone: '07 00 00 00 00' });

    await expect(new GetPersonalInfoFromSessionUseCase(sessions, personalInfos).execute()).resolves.toMatchObject({
      contact: { phone: '07 00 00 00 00' },
    });
  });

  it('refuses when the session carries no company', async () => {
    const useCase = new GetPersonalInfoFromSessionUseCase(new InMemorySessionGateway('u1', { ...actor, companyId: null }), gateway());

    await expect(useCase.execute()).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
