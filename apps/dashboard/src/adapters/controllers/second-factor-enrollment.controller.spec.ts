import { describe, expect, it } from 'vitest';
import {
  ApiSecondFactorEnrollmentGateway,
  InMemoryHttpClient,
} from '@hexagonal-monorepo-template/adapters';
import { ConfirmSecondFactorEnrollmentViaGatewayUseCase } from '@hexagonal-monorepo-template/application';
import { ErrorCode, UserRole } from '@hexagonal-monorepo-template/domain';
import { SecondFactorEnrollmentController } from './second-factor-enrollment.controller';

const OPENED = {
  session: {
    accessToken: 'session:alice',
    companyId: 'c1',
    role: UserRole.EMPLOYEE,
  },
  employee: { id: 'e1', firstName: 'Alice', lastName: 'Martin' },
};

function controllerOver(http: InMemoryHttpClient) {
  return new SecondFactorEnrollmentController(
    new ConfirmSecondFactorEnrollmentViaGatewayUseCase(
      new ApiSecondFactorEnrollmentGateway(http),
    ),
  );
}

describe('SecondFactorEnrollmentController', () => {
  it('confirms the enrollment with the code and returns the opened workspace', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'second-factor/enrollment-confirmation', {
      status: 201,
      data: OPENED,
    });

    await expect(
      controllerOver(http).confirm('enrollment-1', '287082'),
    ).resolves.toEqual(OPENED);
    expect(http.calls[0]?.data).toEqual({
      enrollmentId: 'enrollment-1',
      code: '287082',
    });
  });

  it('lets the refusal reach the screen', async () => {
    const http = new InMemoryHttpClient();
    http.reject(
      'post',
      'second-factor/enrollment-confirmation',
      new Error(ErrorCode.ACCESS_DENIED),
    );

    await expect(
      controllerOver(http).confirm('enrollment-1', '000000'),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
