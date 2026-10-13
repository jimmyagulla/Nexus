import { Controller, DynamicModule, Get, Global, INestApplication, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { InMemorySecondFactorIdentityBinder } from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { computeTotp } from '@hexagonal-monorepo-template/infrastructure';
import { ISecondFactorIdentityBinder } from '@hexagonal-monorepo-template/ports';
import { ApiExceptionFilter } from '../../adapters/http/common/filters/api-exception.filter';
import { AuthenticatedRequest } from '../../adapters/http/common/guards/authenticated-request';
import { SecondFactorGuard } from '../../adapters/http/common/guards/second-factor/second-factor.guard';
import { SuccessResponseInterceptor } from '../../adapters/http/common/interceptors/success-response.interceptor';
import { createValidationPipe } from '../../adapters/http/common/pipes/create-validation.pipe';
import { ClockModule } from '../clock/clock.module';
import { API_CONFIG, loadApiConfig } from '../config/load-api-config';
import { SecondFactorModule } from './second-factor.module';

@Controller('space')
class PersonalSpaceController {
  @Get()
  open(): { name: string } {
    return { name: 'Mon espace' };
  }
}

@Global()
@Module({})
class TestGlobalsModule {}

const globals: DynamicModule = {
  module: TestGlobalsModule,
  global: true,
  providers: [{ provide: API_CONFIG, useValue: loadApiConfig({}) }],
  exports: [API_CONFIG],
};

const employee: ActorContext = {
  userId: 'u1',
  companyId: 'c1',
  role: UserRole.EMPLOYEE,
};

let app: INestApplication;
let baseUrl: string;
let identity: InMemorySecondFactorIdentityBinder;
let role: UserRole;
let userId: string;
let counter = 0;

async function call(
  method: 'GET' | 'POST',
  path: string,
  body?: unknown,
): Promise<{ status: number; payload: Record<string, unknown> }> {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    ...(body === undefined
      ? {}
      : {
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(body),
        }),
  });
  return {
    status: response.status,
    payload: (await response.json()) as Record<string, unknown>,
  };
}

function dataOf(payload: Record<string, unknown>): Record<string, unknown> {
  return payload.data as Record<string, unknown>;
}

async function currentCode(secret: string): Promise<string> {
  return computeTotp(secret, Date.now());
}

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [globals, ClockModule, SecondFactorModule],
    controllers: [PersonalSpaceController],
    providers: [{ provide: APP_GUARD, useClass: SecondFactorGuard }],
  }).compile();

  identity = moduleRef.get<InMemorySecondFactorIdentityBinder>(
    ISecondFactorIdentityBinder,
  );
  app = moduleRef.createNestApplication({ logger: false });
  app.use(
    (request: AuthenticatedRequest, _response: unknown, next: () => void) => {
      request.actor = {
        ...employee,
        userId,
        role,
        ...(identity.verified.has(userId)
          ? { secondFactorVerified: true }
          : {}),
      };
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
  role = UserRole.EMPLOYEE;
  counter += 1;
  userId = `employee-${counter}`;

});

describe('the second factor, from the secret to the personal space', () => {
  it('keeps the personal space closed to an employee who has not enrolled', async () => {
    const space = await call('GET', '/space');

    expect(space.status).toBe(403);
    expect(space.payload).toMatchObject({ message: 'SECOND_FACTOR_REQUIRED' });
  });

  it('leads an employee who is not enrolled to the enrollment and nowhere else', async () => {
    expect(dataOf((await call('GET', '/second-factor/status')).payload)).toEqual({
      step: 'ENROLL',
    });
    expect((await call('GET', '/space')).payload).toMatchObject({
      message: 'SECOND_FACTOR_REQUIRED',
    });
    await call('POST', '/second-factor/enrollment');
    expect(dataOf((await call('GET', '/second-factor/status')).payload)).toEqual({
      step: 'ENROLL',
    });
    expect((await call('GET', '/space')).status).toBe(403);
  });

  it('leads a new employee to the enrollment, then opens the space once enrolled', async () => {
    expect(dataOf((await call('POST', '/second-factor/challenge')).payload)).toEqual({
      step: 'ENROLL',
    });
    const enrollment = dataOf((await call('POST', '/second-factor/enrollment')).payload);

    const confirmation = await call(
      'POST',
      '/second-factor/enrollment/confirmation',
      { code: await currentCode(enrollment.secret as string) },
    );

    expect(confirmation.status).toBe(201);
    expect(dataOf(confirmation.payload).recoveryCodes).toHaveLength(8);
    expect((await call('GET', '/space')).status).toBe(200);
  });

  it('keeps the space closed after an invalid enrollment code', async () => {
    await call('POST', '/second-factor/enrollment');

    const refused = await call('POST', '/second-factor/enrollment/confirmation', {
      code: '000000',
    });

    expect(refused.payload).toMatchObject({ message: 'SECOND_FACTOR_REQUIRED' });
    expect((await call('GET', '/space')).status).toBe(403);
  });

  it('asks an enrolled employee for the second factor at each connection', async () => {
    const enrollment = dataOf((await call('POST', '/second-factor/enrollment')).payload);
    await call('POST', '/second-factor/enrollment/confirmation', {
      code: await currentCode(enrollment.secret as string),
    });
    expect((await call('GET', '/space')).status).toBe(200);

    const challenge = await call('POST', '/second-factor/challenge');

    expect(dataOf(challenge.payload)).toEqual({ step: 'VERIFY' });
    expect((await call('GET', '/space')).status).toBe(403);
  });

  it('opens the space again once the second factor is verified', async () => {
    const enrollment = dataOf((await call('POST', '/second-factor/enrollment')).payload);
    await call('POST', '/second-factor/enrollment/confirmation', {
      code: await currentCode(enrollment.secret as string),
    });
    await call('POST', '/second-factor/challenge');

    const verification = await call('POST', '/second-factor/verification', {
      code: await currentCode(enrollment.secret as string),
    });

    expect(verification.status).toBe(201);
    expect((await call('GET', '/space')).status).toBe(200);
  });

  it('lets a recovery code replace the usual code, once', async () => {
    const enrollment = dataOf((await call('POST', '/second-factor/enrollment')).payload);
    const { recoveryCodes } = dataOf(
      (
        await call('POST', '/second-factor/enrollment/confirmation', {
          code: await currentCode(enrollment.secret as string),
        })
      ).payload,
    ) as { recoveryCodes: string[] };
    await call('POST', '/second-factor/challenge');

    const first = await call('POST', '/second-factor/verification', {
      code: recoveryCodes[0],
    });
    await call('POST', '/second-factor/challenge');
    const second = await call('POST', '/second-factor/verification', {
      code: recoveryCodes[0],
    });

    expect(first.status).toBe(201);
    expect(second.payload).toMatchObject({ message: 'SECOND_FACTOR_REQUIRED' });
    expect((await call('GET', '/space')).status).toBe(403);
  });

  it('lets an employer into a space without any second factor', async () => {
    role = UserRole.EMPLOYER;

    expect((await call('GET', '/space')).status).toBe(200);
    expect(dataOf((await call('POST', '/second-factor/challenge')).payload)).toEqual({
      step: 'NONE',
    });
  });

  it('lets an accounting firm into a space without any second factor', async () => {
    role = UserRole.ACCOUNTANT;

    expect((await call('GET', '/space')).status).toBe(200);
  });

  it('does not enrol an employer', async () => {
    role = UserRole.EMPLOYER;

    expect((await call('POST', '/second-factor/enrollment')).status).toBe(403);
  });
});
