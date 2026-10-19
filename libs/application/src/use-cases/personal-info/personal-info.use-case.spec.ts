import {
  FixedClock,
  InMemoryPersonalInfoRepository,
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
import { GetPersonalInfoUseCase } from './get-personal-info.use-case';
import { UpdatePersonalContactUseCase } from './update-personal-contact.use-case';

const contact = { address: '14 rue des Tilleuls', postalCodeAndCity: '34000 Montpellier', phone: '06 12 34 56 47', email: 'camille.martin@mail.fr' };
const employee: ActorContext = { userId: 'u1', companyId: 'c1', role: UserRole.EMPLOYEE };
const employer: ActorContext = { userId: 'hr1', companyId: 'c1', role: UserRole.EMPLOYER };
const now = new Date('2026-10-03T08:41:00.000Z');

function repository(): InMemoryPersonalInfoRepository {
  return new InMemoryPersonalInfoRepository([
    new PersonalInfo({
      companyId: 'c1', employeeId: 'u1', contact: PersonalContact.parse(contact),
      employment: {
        lastName: 'Martin', firstName: 'Camille', birthDate: CalendarDate.parse('1992-05-18'), socialSecurityNumber: '292057512345641',
        jobTitle: 'Chargée de clientèle', department: 'Commercial', contractType: EmploymentContractType.PERMANENT,
        workingTime: WorkingTime.FULL_TIME, startDate: CalendarDate.parse('2021-03-02'), iban: 'FR7630006000011234567890189',
      },
      updatedAt: new Date('2026-06-12T08:00:00.000Z'),
    }),
  ]);
}

describe('GetPersonalInfoUseCase', () => {
  it('hands the employee their information, and their employer too', async () => {
    const useCase = new GetPersonalInfoUseCase(repository());

    await expect(useCase.execute({ actor: employee, employeeId: 'u1' })).resolves.toMatchObject({ employeeId: 'u1', contact });
    await expect(useCase.execute({ actor: employer, employeeId: 'u1' })).resolves.toMatchObject({ employeeId: 'u1' });
  });

  it('refuses a colleague, and the employer of another company', async () => {
    const useCase = new GetPersonalInfoUseCase(repository());

    await expect(useCase.execute({ actor: { ...employee, userId: 'u2' }, employeeId: 'u1' })).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    await expect(useCase.execute({ actor: { ...employer, companyId: 'c2' }, employeeId: 'u1' })).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses an actor outside any company', async () => {
    await expect(
      new GetPersonalInfoUseCase(repository()).execute({ actor: { ...employee, companyId: null }, employeeId: 'u1' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});

describe('UpdatePersonalContactUseCase', () => {
  it('saves the new contact details of the employee, dated now', async () => {
    const personalInfos = repository();
    const next = { ...contact, address: ' 8 avenue de Lodève ', postalCodeAndCity: '34070 Montpellier' };

    const snapshot = await new UpdatePersonalContactUseCase(personalInfos, new FixedClock(now)).execute({ actor: employee, employeeId: 'u1', contact: next });

    expect(snapshot).toMatchObject({ contact: { address: '8 avenue de Lodève', postalCodeAndCity: '34070 Montpellier' }, updatedAt: now.toISOString() });
    const saved = await personalInfos.findByEmployee({ companyId: 'c1', ownerId: 'u1' });
    expect(saved?.contact.address).toBe('8 avenue de Lodève');
  });

  it('refuses the employer, who only reads the contact details', async () => {
    const personalInfos = repository();

    await expect(
      new UpdatePersonalContactUseCase(personalInfos, new FixedClock(now)).execute({ actor: employer, employeeId: 'u1', contact }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses invalid contact details and keeps the previous ones', async () => {
    const personalInfos = repository();

    await expect(
      new UpdatePersonalContactUseCase(personalInfos, new FixedClock(now)).execute({ actor: employee, employeeId: 'u1', contact: { ...contact, phone: '12' } }),
    ).rejects.toThrow(ErrorCode.INVALID_INFORMATION);
    const kept = await personalInfos.findByEmployee({ companyId: 'c1', ownerId: 'u1' });
    expect(kept?.contact.phone).toBe('06 12 34 56 47');
  });
});
