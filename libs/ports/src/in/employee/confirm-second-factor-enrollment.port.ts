import { OpenedEmployeeWorkspace } from '@hexagonal-monorepo-template/domain';

export interface IConfirmSecondFactorEnrollment {
  execute(input: {
    enrollmentId: string;
    code: string;
  }): Promise<OpenedEmployeeWorkspace>;
}

export const IConfirmSecondFactorEnrollment = Symbol(
  'IConfirmSecondFactorEnrollment',
);
