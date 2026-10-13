import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { ErrorCode, UserRole } from '@hexagonal-monorepo-template/domain';
import { IActivateAccount, ISignIn } from '@hexagonal-monorepo-template/ports';
import { ApiExceptionFilter } from '../common/filters/api-exception.filter';
import { SuccessResponseInterceptor } from '../common/interceptors/success-response.interceptor';
import { createValidationPipe } from '../common/pipes/create-validation.pipe';
import { AccountController } from './account.controller';

const activateAccount = { execute: vi.fn<IActivateAccount['execute']>() };
const signIn = { execute: vi.fn<ISignIn['execute']>() };

let app: INestApplication;
let baseUrl: string;

async function send(
  body?: unknown,
): Promise<{ status: number; payload: unknown }> {
  const response = await fetch(`${baseUrl}/accounts/activation`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body ?? {}),
  });
  return { status: response.status, payload: await response.json() };
}

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    controllers: [AccountController],
    providers: [
      { provide: IActivateAccount, useValue: activateAccount },
      { provide: ISignIn, useValue: signIn },
    ],
  }).compile();

  app = moduleRef.createNestApplication({ logger: false });
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
  activateAccount.execute.mockReset();
  signIn.execute.mockReset();
  activateAccount.execute.mockResolvedValue(undefined);
  signIn.execute.mockResolvedValue({
    accessToken: 'session:founder',
    companyId: 'company-1',
    role: UserRole.EMPLOYER,
  });
});

describe('AccountController', () => {
  it('activates the invited account with the chosen secret', async () => {
    const { status } = await send({
      invitationToken: 'invite-1',
      secret: 's3cret',
    });

    expect(status).toBe(201);
    expect(activateAccount.execute).toHaveBeenCalledWith({
      invitationToken: 'invite-1',
      secret: 's3cret',
    });
  });

  it('answers 400 when the invitation is already used', async () => {
    activateAccount.execute.mockRejectedValue(
      new Error(ErrorCode.INVITATION_INVALID),
    );

    await expect(
      send({ invitationToken: 'invite-1', secret: 's3cret' }),
    ).resolves.toEqual({
      status: 400,
      payload: {
        status: 400,
        message: ErrorCode.INVITATION_INVALID,
      },
    });
  });

  it('opens the company space for the right identifier and secret', async () => {
    await expect(
      fetch(`${baseUrl}/accounts/sign-in`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ identifier: 'founder', secret: 's3cret' }),
      }).then(async (response) => ({
        status: response.status,
        payload: await response.json(),
      })),
    ).resolves.toEqual({
      status: 201,
      payload: {
        status: 201,
        message: 'Success',
        data: {
          accessToken: 'session:founder',
          companyId: 'company-1',
          role: UserRole.EMPLOYER,
        },
      },
    });
    expect(signIn.execute).toHaveBeenCalledWith({
      identifier: 'founder',
      secret: 's3cret',
    });
  });

  it('answers 403 when the secret is wrong', async () => {
    signIn.execute.mockRejectedValue(new Error(ErrorCode.ACCESS_DENIED));

    await expect(
      fetch(`${baseUrl}/accounts/sign-in`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ identifier: 'founder', secret: 'wrong' }),
      }).then(async (response) => ({
        status: response.status,
        payload: await response.json(),
      })),
    ).resolves.toEqual({
      status: 403,
      payload: {
        status: 403,
        message: ErrorCode.ACCESS_DENIED,
      },
    });
  });

  it('answers 400 when the body carries no secret', async () => {
    const { status } = await send({ invitationToken: 'invite-1' });

    expect(status).toBe(400);
    expect(activateAccount.execute).not.toHaveBeenCalled();
  });
});
