import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import {
  ActorContext,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import {
  IBeginSecondFactorEnrollment,
  IConfirmSecondFactorEnrollment,
} from '@hexagonal-monorepo-template/ports';
import { ApiExceptionFilter } from '../common/filters/api-exception.filter';
import { AuthenticatedRequest } from '../common/guards/authenticated-request';
import { SuccessResponseInterceptor } from '../common/interceptors/success-response.interceptor';
import { createValidationPipe } from '../common/pipes/create-validation.pipe';
import { SecondFactorController } from './second-factor.controller';

const begin = { execute: vi.fn<IBeginSecondFactorEnrollment['execute']>() };
const confirm = { execute: vi.fn<IConfirmSecondFactorEnrollment['execute']>() };

const employee: ActorContext = {
  userId: 'u1',
  companyId: 'c1',
  role: UserRole.EMPLOYEE,
};

let app: INestApplication;
let baseUrl: string;
let actor: ActorContext | undefined;

async function post(
  path: string,
  body?: unknown,
): Promise<{ status: number; payload: unknown }> {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
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
    controllers: [SecondFactorController],
    providers: [
      { provide: IBeginSecondFactorEnrollment, useValue: begin },
      { provide: IConfirmSecondFactorEnrollment, useValue: confirm },
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
  actor = employee;
  begin.execute.mockReset();
  confirm.execute.mockReset();
});

describe('SecondFactorController', () => {
  it('begins the enrollment of the signed-in employee', async () => {
    begin.execute.mockResolvedValue({
      secret: 'SECRET',
      provisioningUri: 'otpauth://x',
    });

    const { status, payload } = await post('/second-factor/enrollment');

    expect(status).toBe(201);
    expect(payload).toMatchObject({
      data: { secret: 'SECRET', provisioningUri: 'otpauth://x' },
    });
    expect(begin.execute).toHaveBeenCalledWith({ actor: employee });
  });

  it('confirms the enrollment with the code', async () => {
    confirm.execute.mockResolvedValue({ enrolled: true });

    const { status, payload } = await post(
      '/second-factor/enrollment/confirmation',
      { code: '123456' },
    );

    expect(status).toBe(201);
    expect(payload).toMatchObject({ data: { enrolled: true } });
    expect(confirm.execute).toHaveBeenCalledWith({
      actor: employee,
      code: '123456',
    });
  });

  it('answers the refusal of an invalid code', async () => {
    confirm.execute.mockRejectedValue(
      new Error(ErrorCode.SECOND_FACTOR_REQUIRED),
    );

    const { status, payload } = await post(
      '/second-factor/enrollment/confirmation',
      { code: '000000' },
    );

    expect(status).toBe(400);
    expect(payload).toMatchObject({ message: ErrorCode.SECOND_FACTOR_REQUIRED });
  });

  it('refuses an employer', async () => {
    actor = { ...employee, role: UserRole.EMPLOYER };

    const { status } = await post('/second-factor/enrollment');

    expect(status).toBe(403);
    expect(begin.execute).not.toHaveBeenCalled();
  });

  it('refuses a request without actor', async () => {
    actor = undefined;

    const { status } = await post('/second-factor/enrollment');

    expect(status).toBe(403);
  });

  it('refuses a confirmation without code', async () => {
    const { status } = await post('/second-factor/enrollment/confirmation', {});

    expect(status).toBe(400);
    expect(confirm.execute).not.toHaveBeenCalled();
  });
});
