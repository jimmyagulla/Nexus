import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AccountStatus,
  AccountSummary,
  ActorContext,
  ErrorCode,
  InvitedAccount,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import {
  IDisableAccount,
  IInviteEmployer,
} from '@hexagonal-monorepo-template/ports';
import { ApiExceptionFilter } from '../common/filters/api-exception.filter';
import { AuthenticatedRequest } from '../common/guards/authenticated-request';
import { SuccessResponseInterceptor } from '../common/interceptors/success-response.interceptor';
import { createValidationPipe } from '../common/pipes/create-validation.pipe';
import { CompanyAccountsController } from './company-accounts.controller';

const inviteEmployer = {
  execute: vi.fn<IInviteEmployer['execute']>(),
};
const disableAccount = {
  execute: vi.fn<IDisableAccount['execute']>(),
};

const employer: ActorContext = {
  userId: 'founder',
  companyId: 'company-1',
  role: UserRole.EMPLOYER,
};

const invited: InvitedAccount = {
  id: 'account-2',
  identifier: 'colleague',
  role: UserRole.EMPLOYER,
  status: AccountStatus.INVITED,
  invitationToken: 'invite-2',
};

const disabled: AccountSummary = {
  id: 'account-2',
  identifier: 'colleague',
  role: UserRole.EMPLOYER,
  status: AccountStatus.DISABLED,
};

const ACCOUNTS_PATH = '/companies/company-1/accounts';
const DISABLE_PATH = '/companies/company-1/accounts/account-2/disable';

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
    controllers: [CompanyAccountsController],
    providers: [
      { provide: IInviteEmployer, useValue: inviteEmployer },
      { provide: IDisableAccount, useValue: disableAccount },
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
  inviteEmployer.execute.mockReset();
  inviteEmployer.execute.mockResolvedValue(invited);
  disableAccount.execute.mockReset();
  disableAccount.execute.mockResolvedValue(disabled);
});

describe('CompanyAccountsController', () => {
  describe('POST /companies/:companyId/accounts/:accountId/disable', () => {
    it('answers 201 with the disabled account', async () => {
      await expect(send('POST', DISABLE_PATH)).resolves.toEqual({
        status: 201,
        payload: { status: 201, message: 'Success', data: disabled },
      });
    });

    it('hands the actor and the account of the path to the use case', async () => {
      await send('POST', DISABLE_PATH);

      expect(disableAccount.execute).toHaveBeenCalledWith({
        actor: employer,
        accountId: 'account-2',
      });
    });

    it('answers 403 when the actor is an employee', async () => {
      actor = { ...employer, role: UserRole.EMPLOYEE };

      const { status } = await send('POST', DISABLE_PATH);

      expect(status).toBe(403);
      expect(disableAccount.execute).not.toHaveBeenCalled();
    });

    it('answers 403 when the use case refuses to disable the last employer', async () => {
      disableAccount.execute.mockRejectedValue(
        new Error(ErrorCode.ACCESS_DENIED),
      );

      await expect(send('POST', DISABLE_PATH)).resolves.toEqual({
        status: 403,
        payload: { status: 403, message: ErrorCode.ACCESS_DENIED },
      });
    });
  });

  describe('POST /companies/:companyId/accounts', () => {
    it('answers 201 with the invited account', async () => {
      await expect(
        send('POST', ACCOUNTS_PATH, { identifier: 'colleague' }),
      ).resolves.toEqual({
        status: 201,
        payload: { status: 201, message: 'Success', data: invited },
      });
    });

    it('hands the actor and the identifier to the use case', async () => {
      await send('POST', ACCOUNTS_PATH, { identifier: 'colleague' });

      expect(inviteEmployer.execute).toHaveBeenCalledWith({
        actor: employer,
        identifier: 'colleague',
      });
    });

    it('answers 400 when the identifier is missing', async () => {
      const { status } = await send('POST', ACCOUNTS_PATH, {});

      expect(status).toBe(400);
      expect(inviteEmployer.execute).not.toHaveBeenCalled();
    });

    it('answers 403 when the actor is an employee', async () => {
      actor = { ...employer, role: UserRole.EMPLOYEE };

      const { status } = await send('POST', ACCOUNTS_PATH, {
        identifier: 'colleague',
      });

      expect(status).toBe(403);
      expect(inviteEmployer.execute).not.toHaveBeenCalled();
    });

    it('answers 403 when the actor is bound to another company', async () => {
      actor = { ...employer, companyId: 'company-2' };

      const { status } = await send('POST', ACCOUNTS_PATH, {
        identifier: 'colleague',
      });

      expect(status).toBe(403);
      expect(inviteEmployer.execute).not.toHaveBeenCalled();
    });

    it('answers 400 when the identifier already exists', async () => {
      inviteEmployer.execute.mockRejectedValue(
        new Error(ErrorCode.POTENTIAL_DUPLICATE),
      );

      await expect(
        send('POST', ACCOUNTS_PATH, { identifier: 'colleague' }),
      ).resolves.toEqual({
        status: 400,
        payload: { status: 400, message: ErrorCode.POTENTIAL_DUPLICATE },
      });
    });
  });
});
