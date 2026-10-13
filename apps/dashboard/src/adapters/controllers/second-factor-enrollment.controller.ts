import { OpenedEmployeeWorkspace } from '@hexagonal-monorepo-template/domain';
import { IConfirmSecondFactorEnrollment } from '@hexagonal-monorepo-template/ports';

export class SecondFactorEnrollmentController {
  constructor(
    private readonly confirmEnrollment: IConfirmSecondFactorEnrollment,
  ) {}

  confirm(
    enrollmentId: string,
    code: string,
  ): Promise<OpenedEmployeeWorkspace> {
    return this.confirmEnrollment.execute({ enrollmentId, code });
  }
}
