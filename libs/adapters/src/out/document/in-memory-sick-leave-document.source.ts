import { SickLeaveDocument } from '@hexagonal-monorepo-template/domain';
import { ISickLeaveDocumentSource } from '@hexagonal-monorepo-template/ports';

export class InMemorySickLeaveDocumentSource
  implements ISickLeaveDocumentSource
{
  constructor(private readonly documents: readonly SickLeaveDocument[] = []) {}

  async listForEmployee(
    companyId: string,
    employeeId: string,
  ): Promise<readonly SickLeaveDocument[]> {
    return this.documents.filter(
      (document) =>
        document.companyId === companyId && document.employeeId === employeeId,
    );
  }
}
