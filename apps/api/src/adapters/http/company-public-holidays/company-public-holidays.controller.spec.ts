import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ActorContext,
  CompanySettingsSnapshot,
  DayOfWeek,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import {
  IAddCompanyPublicHoliday,
  IRemoveCompanyPublicHoliday,
  IUpdateCompanyPublicHoliday,
} from '@hexagonal-monorepo-template/ports';
import { ApiExceptionFilter } from '../common/filters/api-exception.filter';
import { AuthenticatedRequest } from '../common/guards/authenticated-request';
import { SuccessResponseInterceptor } from '../common/interceptors/success-response.interceptor';
import { createValidationPipe } from '../common/pipes/create-validation.pipe';
import { CompanyPublicHolidaysController } from './company-public-holidays.controller';

const addHoliday = { execute: vi.fn<IAddCompanyPublicHoliday['execute']>() };
const updateHoliday = {
  execute: vi.fn<IUpdateCompanyPublicHoliday['execute']>(),
};
const removeHoliday = {
  execute: vi.fn<IRemoveCompanyPublicHoliday['execute']>(),
};

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

const HOLIDAYS_PATH = '/companies/company-1/calendar/public-holidays';
const HOLIDAY_PATH = `${HOLIDAYS_PATH}/holiday-1`;

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
    controllers: [CompanyPublicHolidaysController],
    providers: [
      { provide: IAddCompanyPublicHoliday, useValue: addHoliday },
      { provide: IUpdateCompanyPublicHoliday, useValue: updateHoliday },
      { provide: IRemoveCompanyPublicHoliday, useValue: removeHoliday },
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
  addHoliday.execute.mockReset();
  updateHoliday.execute.mockReset();
  removeHoliday.execute.mockReset();
  addHoliday.execute.mockResolvedValue(settings);
  updateHoliday.execute.mockResolvedValue(settings);
  removeHoliday.execute.mockResolvedValue(settings);
});

describe('CompanyPublicHolidaysController', () => {
  describe('POST /companies/:companyId/calendar/public-holidays', () => {
    it('answers 201 with the updated company settings', async () => {
      await expect(
        send('POST', HOLIDAYS_PATH, { date: '2026-07-14', label: 'Fête' }),
      ).resolves.toEqual({
        status: 201,
        payload: { status: 201, message: 'Success', data: settings },
      });
    });

    it('hands the retained date and label to the use case', async () => {
      await send('POST', HOLIDAYS_PATH, {
        date: '2026-07-14',
        label: 'Fête nationale',
      });

      expect(addHoliday.execute).toHaveBeenCalledWith({
        actor: employer,
        companyId: 'company-1',
        date: '2026-07-14',
        label: 'Fête nationale',
      });
    });

    it('answers 400 when the submitted date is malformed', async () => {
      const { status } = await send('POST', HOLIDAYS_PATH, {
        date: '14/07/2026',
        label: 'Fête',
      });

      expect(status).toBe(400);
      expect(addHoliday.execute).not.toHaveBeenCalled();
    });

    it('answers 403 when the actor is not an employer', async () => {
      actor = { ...employer, role: UserRole.EMPLOYEE };

      const { status } = await send('POST', HOLIDAYS_PATH, {
        date: '2026-07-14',
        label: 'Fête',
      });

      expect(status).toBe(403);
      expect(addHoliday.execute).not.toHaveBeenCalled();
    });
  });

  describe('PATCH /companies/:companyId/calendar/public-holidays/:publicHolidayId', () => {
    it('answers 200 with the updated company settings', async () => {
      await expect(
        send('PATCH', HOLIDAY_PATH, { date: '2026-12-25', label: 'Noël' }),
      ).resolves.toEqual({
        status: 200,
        payload: { status: 200, message: 'Success', data: settings },
      });
    });

    it('hands the holiday of the path and the submitted fields to the use case', async () => {
      await send('PATCH', HOLIDAY_PATH, { date: '2026-12-25', label: 'Noël' });

      expect(updateHoliday.execute).toHaveBeenCalledWith({
        actor: employer,
        companyId: 'company-1',
        publicHolidayId: 'holiday-1',
        date: '2026-12-25',
        label: 'Noël',
      });
    });

    it('answers 400 when the submitted label is empty', async () => {
      const { status } = await send('PATCH', HOLIDAY_PATH, {
        date: '2026-12-25',
        label: '',
      });

      expect(status).toBe(400);
      expect(updateHoliday.execute).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /companies/:companyId/calendar/public-holidays/:publicHolidayId', () => {
    it('answers 200 with the updated company settings', async () => {
      await expect(send('DELETE', HOLIDAY_PATH)).resolves.toEqual({
        status: 200,
        payload: { status: 200, message: 'Success', data: settings },
      });
    });

    it('hands the holiday of the path to the use case', async () => {
      await send('DELETE', HOLIDAY_PATH);

      expect(removeHoliday.execute).toHaveBeenCalledWith({
        actor: employer,
        companyId: 'company-1',
        publicHolidayId: 'holiday-1',
      });
    });

    it('answers 403 when the actor is bound to another company', async () => {
      actor = { ...employer, companyId: 'company-2' };

      const { status } = await send('DELETE', HOLIDAY_PATH);

      expect(status).toBe(403);
      expect(removeHoliday.execute).not.toHaveBeenCalled();
    });
  });

  describe('business failures', () => {
    it('answers 400 when the holiday duplicates a retained one', async () => {
      addHoliday.execute.mockRejectedValue(
        new Error(ErrorCode.POTENTIAL_DUPLICATE),
      );

      await expect(
        send('POST', HOLIDAYS_PATH, { date: '2026-07-14', label: 'Fête' }),
      ).resolves.toEqual({
        status: 400,
        payload: { status: 400, message: ErrorCode.POTENTIAL_DUPLICATE },
      });
    });

    it('answers 403 when the use case denies access to the holiday', async () => {
      updateHoliday.execute.mockRejectedValue(
        new Error(ErrorCode.ACCESS_DENIED),
      );

      await expect(
        send('PATCH', HOLIDAY_PATH, { date: '2026-12-25', label: 'Noël' }),
      ).resolves.toEqual({
        status: 403,
        payload: { status: 403, message: ErrorCode.ACCESS_DENIED },
      });
    });
  });
});
