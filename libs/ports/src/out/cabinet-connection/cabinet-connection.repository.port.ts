import { CabinetConnection } from '@hexagonal-monorepo-template/domain';

export interface ICabinetConnectionRepository {
  save(connection: CabinetConnection): Promise<void>;
  findByCompanyId(companyId: string): Promise<CabinetConnection | null>;
}

export const ICabinetConnectionRepository = Symbol(
  'ICabinetConnectionRepository',
);
