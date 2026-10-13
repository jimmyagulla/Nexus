import { CabinetExchange } from '@hexagonal-monorepo-template/domain';

export interface ICabinetExchangeRepository {
  nextId(): string;
  save(exchange: CabinetExchange): Promise<void>;
  findById(id: string): Promise<CabinetExchange | null>;
  listByCompany(companyId: string): Promise<readonly CabinetExchange[]>;
}

export const ICabinetExchangeRepository = Symbol('ICabinetExchangeRepository');
