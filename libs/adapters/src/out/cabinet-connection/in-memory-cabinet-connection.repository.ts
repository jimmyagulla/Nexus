import { CabinetConnection } from '@hexagonal-monorepo-template/domain';
import { ICabinetConnectionRepository } from '@hexagonal-monorepo-template/ports';

export class InMemoryCabinetConnectionRepository
  implements ICabinetConnectionRepository
{
  constructor(
    private readonly connections = new Map<string, CabinetConnection>(),
  ) {}

  async save(connection: CabinetConnection): Promise<void> {
    this.connections.set(connection.companyId, connection);
  }

  async findByCompanyId(companyId: string): Promise<CabinetConnection | null> {
    return this.connections.get(companyId) ?? null;
  }
}
