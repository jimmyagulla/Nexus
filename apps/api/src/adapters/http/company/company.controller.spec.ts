import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ActorContext,
  CompanySettingsSnapshot,
  Company,
  CompanyCalendar,
  CompanyName,
  DayOfWeek,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import {
  ICreateCompany,
  IRenameCompany,
} from '@hexagonal-monorepo-template/ports';
import { ApiExceptionFilter } from '../common/filters/api-exception.filter';
import { AuthenticatedRequest } from '../common/guards/authenticated-request';
import { SuccessResponseInterceptor } from '../common/interceptors/success-response.interceptor';
import { createValidationPipe } from '../common/pipes/create-validation.pipe';
import { CompanyController } from './company.controller';

const createCompany = { execute: vi.fn<ICreateCompany['execute']>() };
const renameCompany = { execute: vi.fn<IRenameCompany['execute']>() };

const employer: ActorContext = {
  userId: 'user-1',
  companyId: 'company-1',
  role: UserRole.EMPLOYER,
};

const settings: CompanySettingsSnapshot = {
  id: 'company-1',
  name: 'Acme',
  nonWorkingWeekdays: [DayOfWeek.SUNDAY],
  publicHolidays: [{ id: 'holiday-1', date: '2026-07-14', label: 'Fête' }],
};

let app: INestApplication;
let baseUrl: string;
let actor: ActorContext | undefined;

async function send(
  method: string,
  path: string,
  body?: unknown,
): Promise<{ status: number; payload: unknown }> {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    ...(body === undefined
      ? {}
      : {
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(body),
        }),
  });

  return { status: response.status, payload: await response.json() };
}

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    controllers: [CompanyController],
    providers: [
      { provide: ICreateCompany, useValue: createCompany },
      { provide: IRenameCompany, useValue: renameCompany },
    ],
  }).compile();

  app = moduleRef.createNestApplication({ logger: false });
  app.use(
    (request: AuthenticatedRequest, _response: unknown, next: () => void) => {
      request.actor = actor;
      next();
    },
  );
  app.useGlobalPipes(createValidationPipe());
  app.useGlobalInterceptors(new SuccessResponseInterceptor());
  app.useGlobalFilters(new ApiExceptionFilter());
  await app.listen(0);
  baseUrl = await app.getUrl();
});

afterAll(async () => {
  await app.close();
});

beforeEach(() => {
  actor = employer;
  createCompany.execute.mockReset();
  renameCompany.execute.mockReset();
  createCompany.execute.mockResolvedValue(
    new Company(
      'company-1',
      CompanyName.parse('Acme'),
      new CompanyCalendar([DayOfWeek.SUNDAY], []),
    ),
  );
  renameCompany.execute.mockResolvedValue(settings);
});

describe('CompanyController', () => {
  describe('POST /companies', () => {
    it('answers 201 with the created company settings', async () => {
      await expect(send('POST', '/companies', { name: 'Acme' })).resolves.toEqual(
        {
          status: 201,
          payload: {
            status: 201,
            message: 'Success',
            data: {
              id: 'company-1',
              name: 'Acme',
              nonWorkingWeekdays: [DayOfWeek.SUNDAY],
              publicHolidays: [],
            },
          },
        },
      );
    });

    it('hands the actor and the submitted name to the use case', async () => {
      await send('POST', '/companies', { name: 'Acme' });

      expect(createCompany.execute).toHaveBeenCalledWith({
        actor: employer,
        name: 'Acme',
      });
    });

    it('lets an actor bound to no company create one', async () => {
      actor = { userId: 'user-2', companyId: null, role: null };

      const { status } = await send('POST', '/companies', { name: 'Acme' });

      expect(status).toBe(201);
    });

    it('answers 400 when the body carries no name', async () => {
      const { status } = await send('POST', '/companies', {});

      expect(status).toBe(400);
      expect(createCompany.execute).not.toHaveBeenCalled();
    });

    it('answers 403 when the request carries no actor', async () => {
      actor = undefined;

      await expect(send('POST', '/companies', { name: 'Acme' })).resolves.toEqual(
        {
          status: 403,
          payload: { status: 403, message: ErrorCode.ACCESS_DENIED },
        },
      );
    });
  });

  describe('PATCH /companies/:companyId/name', () => {
    it('answers 200 with the renamed company settings', async () => {
      await expect(
        send('PATCH', '/companies/company-1/name', { name: 'Acme Europe' }),
      ).resolves.toEqual({
        status: 200,
        payload: { status: 200, message: 'Success', data: settings },
      });
    });

    it('hands the company of the path and the name of the body to the use case', async () => {
      await send('PATCH', '/companies/company-1/name', { name: 'Acme Europe' });

      expect(renameCompany.execute).toHaveBeenCalledWith({
        actor: employer,
        companyId: 'company-1',
        name: 'Acme Europe',
      });
    });

    it('answers 403 when the actor is not an employer', async () => {
      actor = { ...employer, role: UserRole.EMPLOYEE };

      const { status } = await send('PATCH', '/companies/company-1/name', {
        name: 'Acme Europe',
      });

      expect(status).toBe(403);
      expect(renameCompany.execute).not.toHaveBeenCalled();
    });

    it('answers 403 when the actor is bound to another company', async () => {
      actor = { ...employer, companyId: 'company-2' };

      const { status } = await send('PATCH', '/companies/company-1/name', {
        name: 'Acme Europe',
      });

      expect(status).toBe(403);
      expect(renameCompany.execute).not.toHaveBeenCalled();
    });

    it('answers 400 when the body carries no name', async () => {
      const { status } = await send('PATCH', '/companies/company-1/name', {});

      expect(status).toBe(400);
      expect(renameCompany.execute).not.toHaveBeenCalled();
    });
  });

  describe('business failures', () => {
    it('answers 403 when the use case denies access', async () => {
      renameCompany.execute.mockRejectedValue(
        new Error(ErrorCode.ACCESS_DENIED),
      );

      await expect(
        send('PATCH', '/companies/company-1/name', { name: 'Acme Europe' }),
      ).resolves.toEqual({
        status: 403,
        payload: { status: 403, message: ErrorCode.ACCESS_DENIED },
      });
    });

    it('answers 400 when the use case refuses the submitted data', async () => {
      renameCompany.execute.mockRejectedValue(
        new Error(ErrorCode.REQUIRED_INFORMATION),
      );

      await expect(
        send('PATCH', '/companies/company-1/name', { name: 'Acme Europe' }),
      ).resolves.toEqual({
        status: 400,
        payload: { status: 400, message: ErrorCode.REQUIRED_INFORMATION },
      });
    });

    it('answers 500 without leaking the cause of an unexpected failure', async () => {
      renameCompany.execute.mockRejectedValue(
        new Error('connection to the database lost'),
      );

      await expect(
        send('PATCH', '/companies/company-1/name', { name: 'Acme Europe' }),
      ).resolves.toEqual({
        status: 500,
        payload: { status: 500, message: 'Internal server error' },
      });
    });
  });
});
