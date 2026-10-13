import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { ActorContext, UserRole } from '@hexagonal-monorepo-template/domain';
import { IJwtVerifier } from '@hexagonal-monorepo-template/ports';
import { AppModule } from '../app.module';

const actors: Record<string, ActorContext> = {
  employee: { userId: 'e1', companyId: 'c1', role: UserRole.EMPLOYEE },
  'verified-employee': {
    userId: 'e2',
    companyId: 'c1',
    role: UserRole.EMPLOYEE,
    secondFactorVerified: true,
  },
  employer: { userId: 'r1', companyId: null, role: UserRole.EMPLOYER },
  accountant: { userId: 'a1', companyId: null, role: UserRole.ACCOUNTANT },
};

let app: INestApplication;
let baseUrl: string;

async function call(
  as: string,
  method: 'GET' | 'POST',
  path: string,
  body?: unknown,
): Promise<{ status: number; payload: Record<string, unknown> }> {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      authorization: `Bearer ${as}`,
      ...(body === undefined ? {} : { 'content-type': 'application/json' }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  return {
    status: response.status,
    payload: (await response.json()) as Record<string, unknown>,
  };
}

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(IJwtVerifier)
    .useValue({
      verify: async (token: string) => {
        const actor = actors[token];
        if (actor === undefined) {
          throw new Error('unknown token');
        }
        return actor;
      },
    })
    .compile();

  app = moduleRef.createNestApplication({ logger: false });
  await app.listen(0);
  baseUrl = await app.getUrl();
});

afterAll(async () => {
  await app.close();
});

describe('who owes the second factor, through the whole api', () => {
  it('keeps every personal route closed to an employee who gave the secret only', async () => {
    const { status, payload } = await call(
      'employee',
      'GET',
      '/companies/c1/settings',
    );

    expect(status).toBe(403);
    expect(payload).toMatchObject({ message: 'SECOND_FACTOR_REQUIRED' });
  });

  it('still lets that employee reach the way to the second factor', async () => {
    const { status, payload } = await call(
      'employee',
      'GET',
      '/second-factor/status',
    );

    expect(status).toBe(200);
    expect(payload).toMatchObject({ data: { step: 'ENROLL' } });
  });

  it('lets an employer into the company space without any second factor', async () => {
    const { status } = await call('employer', 'POST', '/companies', {
      name: 'Acme',
    });

    expect(status).toBe(201);
  });

  it('asks nothing from an employer at the second factor step', async () => {
    const { payload } = await call('employer', 'POST', '/second-factor/challenge');

    expect(payload).toMatchObject({ data: { step: 'NONE' } });
  });

  it('does not ask an accounting firm for a second factor either', async () => {
    const status = await call('accountant', 'GET', '/second-factor/status');
    const space = await call('accountant', 'POST', '/companies', {
      name: 'Cabinet',
    });

    expect(status.payload).toMatchObject({ data: { step: 'NONE' } });
    expect(space.payload).not.toMatchObject({
      message: 'SECOND_FACTOR_REQUIRED',
    });
  });

  it('owes nothing more once the second factor of an employee is verified', async () => {
    const { payload } = await call(
      'verified-employee',
      'GET',
      '/second-factor/status',
    );

    expect(payload).toMatchObject({ data: { step: 'NONE' } });
  });

  it('does not enrol an employer', async () => {
    const { status } = await call('employer', 'POST', '/second-factor/enrollment');

    expect(status).toBe(403);
  });
});
