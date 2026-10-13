import { describe, expect, it } from 'vitest';
import { ErrorCode, UserRole } from '@hexagonal-monorepo-template/domain';
import { InMemoryHttpClient } from '../http/in-memory-http-client';
import { ApiSecondFactorEnrollmentGateway } from './api-second-factor-enrollment.gateway';

const OPENED = {
  session: {
    accessToken: 'session:alice',
    companyId: 'c1',
    role: UserRole.EMPLOYEE,
  },
  employee: { id: 'e1', firstName: 'Alice', lastName: 'Martin' },
};

describe('ApiSecondFactorEnrollmentGateway', () => {
  it('posts the enrollment and the proven code to the confirmation route', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'second-factor/enrollment-confirmation', {
      status: 201,
      data: OPENED,
    });

    await new ApiSecondFactorEnrollmentGateway(http).confirm({
      enrollmentId: 'enrollment-1',
      code: '287082',
    });

    expect(http.calls).toEqual([
      {
        method: 'post',
        url: 'second-factor/enrollment-confirmation',
        data: { enrollmentId: 'enrollment-1', code: '287082' },
        config: undefined,
      },
    ]);
  });

  it('hands back the workspace the server opened', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'second-factor/enrollment-confirmation', {
      status: 201,
      data: OPENED,
    });

    await expect(
      new ApiSecondFactorEnrollmentGateway(http).confirm({
        enrollmentId: 'enrollment-1',
        code: '287082',
      }),
    ).resolves.toEqual(OPENED);
  });

  it('lets the refusal of the server reach its caller', async () => {
    const http = new InMemoryHttpClient();
    http.reject(
      'post',
      'second-factor/enrollment-confirmation',
      new Error(ErrorCode.ACCESS_DENIED),
    );

    await expect(
      new ApiSecondFactorEnrollmentGateway(http).confirm({
        enrollmentId: 'enrollment-1',
        code: '000000',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
