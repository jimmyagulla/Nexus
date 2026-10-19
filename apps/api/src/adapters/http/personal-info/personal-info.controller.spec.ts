import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import {
  GetPersonalInfoUseCase,
  UpdatePersonalContactUseCase,
} from '@hexagonal-monorepo-template/application';
import {
  FixedClock,
  InMemoryPersonalInfoRepository,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  CalendarDate,
  EmploymentContractType,
  PersonalContact,
  PersonalInfo,
  UserRole,
  WorkingTime,
} from '@hexagonal-monorepo-template/domain';
import {
  IGetPersonalInfo,
  IUpdatePersonalContact,
} from '@hexagonal-monorepo-template/ports';
import { ApiExceptionFilter } from '../common/filters/api-exception.filter';
import { CompanyScopeGuard } from '../common/guards/company-scope/company-scope.guard';
import { AuthenticatedRequest } from '../common/guards/authenticated-request';
import { SuccessResponseInterceptor } from '../common/interceptors/success-response.interceptor';
import { createValidationPipe } from '../common/pipes/create-validation.pipe';
import { PersonalInfoController } from './personal-info.controller';

const employee: ActorContext = { userId: 'user-1', companyId: 'company-1', role: UserRole.EMPLOYEE };
const employer: ActorContext = { userId: 'hr-1', companyId: 'company-1', role: UserRole.EMPLOYER };
const colleague: ActorContext = { userId: 'user-2', companyId: 'company-1', role: UserRole.EMPLOYEE };
const PATH = '/companies/company-1/employees/user-1/personal-info';
const contact = { address: '14 rue des Tilleuls', postalCodeAndCity: '34000 Montpellier', phone: '06 12 34 56 47', email: 'camille.martin@mail.fr' };
const now = new Date('2026-10-03T08:41:00.000Z');

let app: INestApplication;
let baseUrl: string;
let actor: ActorContext | undefined;

type Envelope = { status: number; message: string; data: unknown };

async function send(path: string, init?: { method: string; body: unknown }): Promise<{ status: number; payload: Envelope }> {
  const response = await fetch(`${baseUrl}${path}`, init === undefined ? undefined : {
    method: init.method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(init.body),
  });
  return { status: response.status, payload: (await response.json()) as Envelope };
}

const saved = new PersonalInfo({
  companyId: 'company-1', employeeId: 'user-1', contact: PersonalContact.parse(contact),
  employment: {
    lastName: 'Martin', firstName: 'Camille', birthDate: CalendarDate.parse('1992-05-18'), socialSecurityNumber: '292057512345641',
    jobTitle: 'Chargée de clientèle', department: 'Commercial', contractType: EmploymentContractType.PERMANENT,
    workingTime: WorkingTime.FULL_TIME, startDate: CalendarDate.parse('2021-03-02'), iban: 'FR7630006000011234567890189',
  },
  updatedAt: new Date('2026-06-12T08:00:00.000Z'),
});
const repository = new InMemoryPersonalInfoRepository([saved]);

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    controllers: [PersonalInfoController],
    providers: [
      { provide: IGetPersonalInfo, useFactory: () => new GetPersonalInfoUseCase(repository) },
      { provide: IUpdatePersonalContact, useFactory: () => new UpdatePersonalContactUseCase(repository, new FixedClock(now)) },
    ],
  }).compile();

  app = moduleRef.createNestApplication({ logger: false });
  app.use((request: AuthenticatedRequest, _response: unknown, next: () => void) => {
    request.actor = actor;
    next();
  });
  app.useGlobalPipes(createValidationPipe());
  app.useGlobalInterceptors(new SuccessResponseInterceptor());
  app.useGlobalFilters(new ApiExceptionFilter());
  await app.listen(0);
  baseUrl = await app.getUrl();
});

afterAll(async () => {
  await app.close();
});

beforeEach(async () => {
  actor = employee;
  await repository.save(saved);
});

describe('PersonalInfoController', () => {
  it('is guarded by the company of the actor', () => {
    expect(Reflect.getMetadata('__guards__', PersonalInfoController)).toEqual([CompanyScopeGuard]);
  });

  it('hands the employee their information, sensitive numbers masked', async () => {
    const response = await send(PATH);

    expect(response.status).toBe(200);
    expect(response.payload.data).toEqual({
      employeeId: 'user-1',
      contact,
      employment: {
        lastName: 'Martin', firstName: 'Camille', birthDate: '1992-05-18', socialSecurityNumber: '2 92 05 •• ••• ••• 41',
        jobTitle: 'Chargée de clientèle', department: 'Commercial', contractType: 'PERMANENT', workingTime: 'FULL_TIME',
        startDate: '2021-03-02', iban: 'FR76 •••• •••• •••• •••• •••• 189',
      },
      updatedAt: '2026-06-12T08:00:00.000Z',
    });
  });

  it('hands an employer of the company the information of the employee', async () => {
    actor = employer;

    await expect(send(PATH)).resolves.toMatchObject({ status: 200, payload: { data: { employeeId: 'user-1' } } });
  });

  it('refuses a colleague the reading', async () => {
    actor = colleague;

    await expect(send(PATH)).resolves.toMatchObject({ status: 403 });
  });

  it('refuses the information of an unknown employee like hidden ones', async () => {
    await expect(send('/companies/company-1/employees/nobody/personal-info')).resolves.toMatchObject({ status: 403 });
  });

  it('lets the employee change their contact details', async () => {
    const next = { ...contact, address: '8 avenue de Lodève', postalCodeAndCity: '34070 Montpellier' };

    const response = await send(PATH, { method: 'PATCH', body: next });

    expect(response).toMatchObject({ status: 200, payload: { data: { contact: next, updatedAt: now.toISOString() } } });
    await expect(send(PATH)).resolves.toMatchObject({ payload: { data: { contact: next } } });
  });

  it.each([
    ['an employer', employer],
    ['a colleague', colleague],
  ])('refuses %s the change', async (_who, who) => {
    actor = who;

    await expect(send(PATH, { method: 'PATCH', body: contact })).resolves.toMatchObject({ status: 403 });
    actor = employee;
    await expect(send(PATH)).resolves.toMatchObject({ payload: { data: { updatedAt: '2026-06-12T08:00:00.000Z' } } });
  });

  it('refuses invalid contact details, or a field managed by the employer', async () => {
    await expect(send(PATH, { method: 'PATCH', body: { ...contact, phone: '12' } })).resolves.toMatchObject({ status: 400 });
    await expect(send(PATH, { method: 'PATCH', body: { ...contact, lastName: 'Durand' } })).resolves.toMatchObject({ status: 400 });
  });

  it('refuses the information of another company', async () => {
    await expect(send('/companies/company-2/employees/user-1/personal-info')).resolves.toMatchObject({ status: 403 });
  });
});
