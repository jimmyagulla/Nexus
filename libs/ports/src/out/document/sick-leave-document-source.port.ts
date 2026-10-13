import { SickLeaveDocument } from '@hexagonal-monorepo-template/domain';

export interface ISickLeaveDocumentSource {
  listForEmployee(
    companyId: string,
    employeeId: string,
  ): Promise<readonly SickLeaveDocument[]>;
}

export const ISickLeaveDocumentSource = Symbol('ISickLeaveDocumentSource');
