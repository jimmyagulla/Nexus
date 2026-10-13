import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ActorContext,
  EmployeeInvitation,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { IInviteEmployee } from '@hexagonal-monorepo-template/ports';
import { ApiExceptionFilter } from '../common/filters/api-exception.filter';
import { AuthenticatedRequest } from '../common/guards/authenticated-request';
import { SuccessResponseInterceptor } from '../common/interceptors/success-response.interceptor';
import { createValidationPipe } from '../common/pipes/create-validation.pipe';
import { EmployeeController } from './employee.controller';

const inviteEmployee = { execute: vi.fn<IInviteEmployee['execute']>() };

const employer: ActorContext = {
  userId: 'founder',
  companyId: 'company-1',
  role: UserRole.EMPLOYER,
};

const invitation: EmployeeInvitation = {
  employeeId: 'employee-1',
  accountId: 'account-1',
  identifier: 'alice',
  invitationToken: 'token-1',
};

const INVITATION_PATH = '/companies/company-1/employees/employee-1/invitation';

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
    controllers: [EmployeeController],
    providers: [{ provide: IInviteEmployee, useValue: inviteEmployee }],
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
  inviteEmployee.execute.mockReset();
  inviteEmployee.execute.mockResolvedValue(invitation);
});

describe('EmployeeController', () => {
  describe('POST /companies/:companyId/employees/:employeeId/invitation', () => {
    it('answers 201 with the invitation of the employee record', async () => {
      await expect(
        send('POST', INVITATION_PATH, { identifier: 'alice' }),
      ).resolves.toEqual({
        status: 201,
        payload: { status: 201, message: 'Success', data: invitation },
      });
    });

    it('hands the actor, the record of the path and the identifier to the use case', async () => {
      await send('POST', INVITATION_PATH, { identifier: 'alice' });

      expect(inviteEmployee.execute).toHaveBeenCalledWith({
        actor: employer,
        employeeId: 'employee-1',
        identifier: 'alice',
      });
    });

    it('answers 403 when the actor is not an employer', async () => {
      actor = { ...employer, role: UserRole.EMPLOYEE };

      const { status } = await send('POST', INVITATION_PATH, {
        identifier: 'alice',
      });

      expect(status).toBe(403);
      expect(inviteEmployee.execute).not.toHaveBeenCalled();
    });

    it('answers 403 when the actor is bound to another company', async () => {
      actor = { ...employer, companyId: 'company-2' };

      const { status } = await send('POST', INVITATION_PATH, {
        identifier: 'alice',
      });

      expect(status).toBe(403);
      expect(inviteEmployee.execute).not.toHaveBeenCalled();
    });

    it('answers 403 when the request carries no actor', async () => {
      actor = undefined;

      const { status } = await send('POST', INVITATION_PATH, {
        identifier: 'alice',
      });

      expect(status).toBe(403);
    });

    it('answers 400 when the body carries no identifier', async () => {
      const { status } = await send('POST', INVITATION_PATH, {});

      expect(status).toBe(400);
      expect(inviteEmployee.execute).not.toHaveBeenCalled();
    });

    it('answers 400 with the inactive employee refusal', async () => {
      inviteEmployee.execute.mockRejectedValue(
        new Error(ErrorCode.EMPLOYEE_INACTIVE),
      );

      await expect(
        send('POST', INVITATION_PATH, { identifier: 'alice' }),
      ).resolves.toEqual({
        status: 400,
        payload: { status: 400, message: ErrorCode.EMPLOYEE_INACTIVE },
      });
    });

    it('answers 400 with the business refusal of the use case', async () => {
      inviteEmployee.execute.mockRejectedValue(
        new Error(ErrorCode.POTENTIAL_DUPLICATE),
      );

      await expect(
        send('POST', INVITATION_PATH, { identifier: 'alice' }),
      ).resolves.toEqual({
        status: 400,
        payload: { status: 400, message: ErrorCode.POTENTIAL_DUPLICATE },
      });
    });
  });
});
