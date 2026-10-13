import { OpenedEmployeeWorkspace } from '@hexagonal-monorepo-template/domain';

export interface ISecondFactorEnrollmentGateway {
  confirm(input: {
    enrollmentId: string;
    code: string;
  }): Promise<OpenedEmployeeWorkspace>;
}

export const ISecondFactorEnrollmentGateway = Symbol(
  'ISecondFactorEnrollmentGateway',
);
