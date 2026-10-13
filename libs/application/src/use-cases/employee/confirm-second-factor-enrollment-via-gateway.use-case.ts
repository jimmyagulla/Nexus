import { OpenedEmployeeWorkspace } from '@hexagonal-monorepo-template/domain';
import {
  IConfirmSecondFactorEnrollment,
  ISecondFactorEnrollmentGateway,
} from '@hexagonal-monorepo-template/ports';

export class ConfirmSecondFactorEnrollmentViaGatewayUseCase
  implements IConfirmSecondFactorEnrollment
{
  constructor(private readonly enrollments: ISecondFactorEnrollmentGateway) {}

  execute(input: {
    enrollmentId: string;
    code: string;
  }): Promise<OpenedEmployeeWorkspace> {
    return this.enrollments.confirm(input);
  }
}
