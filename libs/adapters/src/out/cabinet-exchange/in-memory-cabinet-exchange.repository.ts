import { CabinetExchange } from '@hexagonal-monorepo-template/domain';
import { ICabinetExchangeRepository } from '@hexagonal-monorepo-template/ports';

export class InMemoryCabinetExchangeRepository
  implements ICabinetExchangeRepository
{
  constructor(
    private readonly exchanges = new Map<string, CabinetExchange>(),
  ) {}

  nextId(): string {
    return globalThis.crypto.randomUUID();
  }

  async save(exchange: CabinetExchange): Promise<void> {
    this.exchanges.set(exchange.id, exchange);
  }

  async findById(id: string): Promise<CabinetExchange | null> {
    return this.exchanges.get(id) ?? null;
  }

  async listByCompany(companyId: string): Promise<readonly CabinetExchange[]> {
    return [...this.exchanges.values()].filter(
      (exchange) => exchange.companyId === companyId,
    );
  }
}
