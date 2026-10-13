import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ActorContext,
  ErrorCode,
  PresenceSnapshot,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { IListPresences, IOpenPresence } from '@hexagonal-monorepo-template/ports';
import { ApiExceptionFilter } from '../common/filters/api-exception.filter';
import { AuthenticatedRequest } from '../common/guards/authenticated-request';
import { SuccessResponseInterceptor } from '../common/interceptors/success-response.interceptor';
import { createValidationPipe } from '../common/pipes/create-validation.pipe';
import { PresenceController } from './presence.controller';

const openPresence = { execute: vi.fn<IOpenPresence['execute']>() };
const listPresences = { execute: vi.fn<IListPresences['execute']>() };

const employer: ActorContext = {
  userId: 'user-1',
  companyId: 'company-1',
  role: UserRole.EMPLOYER,
};

const presence: PresenceSnapshot = {
  id: 'presence-1',
  employeeId: 'employee-1',
  employeeName: 'Camille Martin',
  month: '2026-10',
  workedDays: 22,
  leaves: [
    {
      id: 'absence-1',
      type: 'Congés payés',
      start: '2026-10-05',
      end: '2026-10-07',
      days: 3,
    },
  ],
  absences: [],
  sickLeaves: [{ id: 'document-1', date: '2026-10-14' }],
  overtime: [{ id: 'hours-1', date: '2026-10-12', hours: 2 }],
};

const PRESENCES_PATH = '/companies/company-1/presences';

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
    controllers: [PresenceController],
    providers: [
      { provide: IOpenPresence, useValue: openPresence },
      { provide: IListPresences, useValue: listPresences },
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
  openPresence.execute.mockReset();
  openPresence.execute.mockResolvedValue(presence);
  listPresences.execute.mockReset();
  listPresences.execute.mockResolvedValue({
    presences: [presence],
    employees: [
      { id: 'employee-1', companyId: 'company-1', fullName: 'Camille Martin' },
    ],
    canManage: true,
  });
});

describe('PresenceController', () => {
  describe('GET /companies/:companyId/presences', () => {
    it('answers 200 with the presences and the employees of the company', async () => {
      await expect(send('GET', PRESENCES_PATH)).resolves.toEqual({
        status: 200,
        payload: {
          status: 200,
          message: 'Success',
          data: {
            presences: [presence],
            employees: [{ id: 'employee-1', fullName: 'Camille Martin' }],
            canManage: true,
          },
        },
      });
    });

    it('hands the actor and the company to the use case', async () => {
      await send('GET', PRESENCES_PATH);

      expect(listPresences.execute).toHaveBeenCalledWith({
        actor: employer,
        companyId: 'company-1',
      });
    });

    it('answers 403 when the actor is bound to another company', async () => {
      actor = { ...employer, companyId: 'company-2' };

      const { status } = await send('GET', PRESENCES_PATH);

      expect(status).toBe(403);
      expect(listPresences.execute).not.toHaveBeenCalled();
    });

    it('answers 403 when the use case denies access', async () => {
      listPresences.execute.mockRejectedValue(new Error(ErrorCode.ACCESS_DENIED));

      await expect(send('GET', PRESENCES_PATH)).resolves.toEqual({
        status: 403,
        payload: { status: 403, message: ErrorCode.ACCESS_DENIED },
      });
    });
  });

  describe('POST /companies/:companyId/presences', () => {
    it('answers 201 with the opened presence', async () => {
      await expect(
        send('POST', PRESENCES_PATH, {
          employeeId: 'employee-1',
          month: '2026-10',
        }),
      ).resolves.toEqual({
        status: 201,
        payload: { status: 201, message: 'Success', data: presence },
      });
    });

    it('hands the employee and the month to the use case', async () => {
      await send('POST', PRESENCES_PATH, {
        employeeId: 'employee-1',
        month: '2026-10',
      });

      expect(openPresence.execute).toHaveBeenCalledWith({
        actor: employer,
        companyId: 'company-1',
        employeeId: 'employee-1',
        month: '2026-10',
      });
    });

    it('answers 400 when the submitted month is malformed', async () => {
      const { status } = await send('POST', PRESENCES_PATH, {
        employeeId: 'employee-1',
        month: '2026-13',
      });

      expect(status).toBe(400);
      expect(openPresence.execute).not.toHaveBeenCalled();
    });

    it('answers 403 when the actor is not an employer', async () => {
      actor = { ...employer, role: UserRole.EMPLOYEE };

      const { status } = await send('POST', PRESENCES_PATH, {
        employeeId: 'employee-1',
        month: '2026-10',
      });

      expect(status).toBe(403);
      expect(openPresence.execute).not.toHaveBeenCalled();
    });

    it('answers 403 when the actor is bound to another company', async () => {
      actor = { ...employer, companyId: 'company-2' };

      const { status } = await send('POST', PRESENCES_PATH, {
        employeeId: 'employee-1',
        month: '2026-10',
      });

      expect(status).toBe(403);
      expect(openPresence.execute).not.toHaveBeenCalled();
    });

    it('answers 400 when the month is already open for the employee', async () => {
      openPresence.execute.mockRejectedValue(
        new Error(ErrorCode.POTENTIAL_DUPLICATE),
      );

      await expect(
        send('POST', PRESENCES_PATH, {
          employeeId: 'employee-1',
          month: '2026-10',
        }),
      ).resolves.toEqual({
        status: 400,
        payload: { status: 400, message: ErrorCode.POTENTIAL_DUPLICATE },
      });
    });

    it('answers 403 when the use case denies access to the employee', async () => {
      openPresence.execute.mockRejectedValue(new Error(ErrorCode.ACCESS_DENIED));

      await expect(
        send('POST', PRESENCES_PATH, {
          employeeId: 'employee-9',
          month: '2026-10',
        }),
      ).resolves.toEqual({
        status: 403,
        payload: { status: 403, message: ErrorCode.ACCESS_DENIED },
      });
    });
  });
});
