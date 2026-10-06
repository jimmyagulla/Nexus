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
  IGetCompanySettings,
  ISetNonWorkingWeekdays,
} from '@hexagonal-monorepo-template/ports';
import { ApiExceptionFilter } from '../common/filters/api-exception.filter';
import { AuthenticatedRequest } from '../common/guards/authenticated-request';
import { SuccessResponseInterceptor } from '../common/interceptors/success-response.interceptor';
import { createValidationPipe } from '../common/pipes/create-validation.pipe';
import { CompanySettingsController } from './company-settings.controller';

const getCompanySettings = {
  execute: vi.fn<IGetCompanySettings['execute']>(),
};
const setNonWorkingWeekdays = {
  execute: vi.fn<ISetNonWorkingWeekdays['execute']>(),
};

const employer: ActorContext = {
  userId: 'user-1',
  companyId: 'company-1',
  role: UserRole.EMPLOYER,
};

const settings: CompanySettingsSnapshot = {
  id: 'company-1',
  name: 'Acme',
  nonWorkingWeekdays: [DayOfWeek.SATURDAY, DayOfWeek.SUNDAY],
  publicHolidays: [{ id: 'holiday-1', date: '2026-07-14', label: 'Fête' }],
};

const SETTINGS_PATH = '/companies/company-1/settings';
const WEEKDAYS_PATH = '/companies/company-1/calendar/non-working-weekdays';

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
    controllers: [CompanySettingsController],
    providers: [
      { provide: IGetCompanySettings, useValue: getCompanySettings },
      { provide: ISetNonWorkingWeekdays, useValue: setNonWorkingWeekdays },
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
  getCompanySettings.execute.mockReset();
  setNonWorkingWeekdays.execute.mockReset();
  getCompanySettings.execute.mockResolvedValue(settings);
  setNonWorkingWeekdays.execute.mockResolvedValue(settings);
});

describe('CompanySettingsController', () => {
  describe('GET /companies/:companyId/settings', () => {
    it('answers 200 with the company settings', async () => {
      await expect(send('GET', SETTINGS_PATH)).resolves.toEqual({
        status: 200,
        payload: { status: 200, message: 'Success', data: settings },
      });
    });

    it('hands the actor and the company of the path to the use case', async () => {
      await send('GET', SETTINGS_PATH);

      expect(getCompanySettings.execute).toHaveBeenCalledWith({
        actor: employer,
        companyId: 'company-1',
      });
    });

    it('answers 403 when the actor is not an employer', async () => {
      actor = { ...employer, role: UserRole.EMPLOYEE };

      const { status } = await send('GET', SETTINGS_PATH);

      expect(status).toBe(403);
      expect(getCompanySettings.execute).not.toHaveBeenCalled();
    });

    it('answers 403 when the actor is bound to another company', async () => {
      actor = { ...employer, companyId: 'company-2' };

      const { status } = await send('GET', SETTINGS_PATH);

      expect(status).toBe(403);
      expect(getCompanySettings.execute).not.toHaveBeenCalled();
    });
  });

  describe('PUT /companies/:companyId/calendar/non-working-weekdays', () => {
    it('answers 200 with the updated company settings', async () => {
      await expect(
        send('PUT', WEEKDAYS_PATH, { weekdays: [DayOfWeek.WEDNESDAY] }),
      ).resolves.toEqual({
        status: 200,
        payload: { status: 200, message: 'Success', data: settings },
      });
    });

    it('hands the submitted weekdays to the use case', async () => {
      await send('PUT', WEEKDAYS_PATH, {
        weekdays: [DayOfWeek.SATURDAY, DayOfWeek.SUNDAY],
      });

      expect(setNonWorkingWeekdays.execute).toHaveBeenCalledWith({
        actor: employer,
        companyId: 'company-1',
        weekdays: [DayOfWeek.SATURDAY, DayOfWeek.SUNDAY],
      });
    });

    it('hands an emptied weekday list to the use case', async () => {
      await send('PUT', WEEKDAYS_PATH, { weekdays: [] });

      expect(setNonWorkingWeekdays.execute).toHaveBeenCalledWith({
        actor: employer,
        companyId: 'company-1',
        weekdays: [],
      });
    });

    it('answers 400 when a submitted weekday is unknown', async () => {
      const { status } = await send('PUT', WEEKDAYS_PATH, {
        weekdays: ['FUNDAY'],
      });

      expect(status).toBe(400);
      expect(setNonWorkingWeekdays.execute).not.toHaveBeenCalled();
    });

    it('answers 403 when the actor is not an employer', async () => {
      actor = { ...employer, role: UserRole.EMPLOYEE };

      const { status } = await send('PUT', WEEKDAYS_PATH, { weekdays: [] });

      expect(status).toBe(403);
      expect(setNonWorkingWeekdays.execute).not.toHaveBeenCalled();
    });
  });

  describe('business failures', () => {
    it('answers 403 when the use case denies access', async () => {
      getCompanySettings.execute.mockRejectedValue(
        new Error(ErrorCode.ACCESS_DENIED),
      );

      await expect(send('GET', SETTINGS_PATH)).resolves.toEqual({
        status: 403,
        payload: { status: 403, message: ErrorCode.ACCESS_DENIED },
      });
    });

    it('answers 400 when the use case refuses the submitted data', async () => {
      setNonWorkingWeekdays.execute.mockRejectedValue(
        new Error(ErrorCode.REQUIRED_INFORMATION),
      );

      await expect(
        send('PUT', WEEKDAYS_PATH, { weekdays: [] }),
      ).resolves.toEqual({
        status: 400,
        payload: { status: 400, message: ErrorCode.REQUIRED_INFORMATION },
      });
    });
  });
});
