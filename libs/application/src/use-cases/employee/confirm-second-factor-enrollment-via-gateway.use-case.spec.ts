import {
  ApiSecondFactorEnrollmentGateway,
  InMemoryHttpClient,
} from '@hexagonal-monorepo-template/adapters';
import { ErrorCode, UserRole } from '@hexagonal-monorepo-template/domain';
import { ConfirmSecondFactorEnrollmentViaGatewayUseCase } from './confirm-second-factor-enrollment-via-gateway.use-case';

const OPENED = {
  session: {
    accessToken: 'session:alice',
    companyId: 'c1',
    role: UserRole.EMPLOYEE,
  },
  employee: { id: 'e1', firstName: 'Alice', lastName: 'Martin' },
};

describe('ConfirmSecondFactorEnrollmentViaGatewayUseCase', () => {
  it('hands the enrollment and the code to the gateway and returns the workspace', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'second-factor/enrollment-confirmation', {
      status: 201,
      data: OPENED,
    });
    const useCase = new ConfirmSecondFactorEnrollmentViaGatewayUseCase(
      new ApiSecondFactorEnrollmentGateway(http),
    );

    const opened = await useCase.execute({
      enrollmentId: 'enrollment-1',
      code: '287082',
    });

    expect(opened).toEqual(OPENED);
    expect(http.calls[0]?.data).toEqual({
      enrollmentId: 'enrollment-1',
      code: '287082',
    });
  });

  it('lets the refusal of the server reach its caller', async () => {
    const http = new InMemoryHttpClient();
    http.reject(
      'post',
      'second-factor/enrollment-confirmation',
      new Error(ErrorCode.ACCESS_DENIED),
    );
    const useCase = new ConfirmSecondFactorEnrollmentViaGatewayUseCase(
      new ApiSecondFactorEnrollmentGateway(http),
    );

    await expect(
      useCase.execute({ enrollmentId: 'enrollment-1', code: '000000' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
