import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ErrorCode,
  OpenedEmployeeWorkspace,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { IConfirmSecondFactorEnrollment } from '@hexagonal-monorepo-template/ports';
import { ApiExceptionFilter } from '../common/filters/api-exception.filter';
import { SuccessResponseInterceptor } from '../common/interceptors/success-response.interceptor';
import { createValidationPipe } from '../common/pipes/create-validation.pipe';
import { SecondFactorEnrollmentController } from './second-factor-enrollment.controller';

const confirmEnrollment = {
  execute: vi.fn<IConfirmSecondFactorEnrollment['execute']>(),
};

const OPENED: OpenedEmployeeWorkspace = {
  session: {
    accessToken: 'session:alice',
    companyId: 'company-1',
    role: UserRole.EMPLOYEE,
  },
  employee: { id: 'employee-1', firstName: 'Alice', lastName: 'Martin' },
};

let app: INestApplication;
let baseUrl: string;

async function send(
  body?: unknown,
): Promise<{ status: number; payload: unknown }> {
  const response = await fetch(
    `${baseUrl}/second-factor/enrollment-confirmation`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body ?? {}),
    },
  );
  return { status: response.status, payload: await response.json() };
}

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    controllers: [SecondFactorEnrollmentController],
    providers: [
      { provide: IConfirmSecondFactorEnrollment, useValue: confirmEnrollment },
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
  confirmEnrollment.execute.mockReset();
  confirmEnrollment.execute.mockResolvedValue(OPENED);
});

describe('SecondFactorEnrollmentController', () => {
  it('answers 201 with the workspace opened for the employee', async () => {
    await expect(
      send({ enrollmentId: 'enrollment-1', code: '287082' }),
    ).resolves.toEqual({
      status: 201,
      payload: { status: 201, message: 'Success', data: OPENED },
    });
  });

  it('hands the enrollment and the code to the use case', async () => {
    await send({ enrollmentId: 'enrollment-1', code: '287082' });

    expect(confirmEnrollment.execute).toHaveBeenCalledWith({
      enrollmentId: 'enrollment-1',
      code: '287082',
    });
  });

  it('answers 403 when the code is refused', async () => {
    confirmEnrollment.execute.mockRejectedValue(
      new Error(ErrorCode.ACCESS_DENIED),
    );

    await expect(
      send({ enrollmentId: 'enrollment-1', code: '000000' }),
    ).resolves.toEqual({
      status: 403,
      payload: { status: 403, message: ErrorCode.ACCESS_DENIED },
    });
  });

  it('answers 400 when the body carries no code', async () => {
    const { status } = await send({ enrollmentId: 'enrollment-1' });

    expect(status).toBe(400);
    expect(confirmEnrollment.execute).not.toHaveBeenCalled();
  });
});
