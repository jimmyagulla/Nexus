import {
  ActorContext,
  CabinetExchange,
  CabinetExchangeSnapshot,
  isVisibleTo,
  requireCompanyEmployer,
  toCabinetExchangeSnapshot,
} from '@hexagonal-monorepo-template/domain';
import {
  ICabinetExchangeRepository,
  IListCabinetExchanges,
} from '@hexagonal-monorepo-template/ports';

export class ListCabinetExchangesUseCase implements IListCabinetExchanges {
  constructor(private readonly exchanges: ICabinetExchangeRepository) {}

  async execute(input: {
    actor: ActorContext;
    companyId: string;
  }): Promise<readonly CabinetExchangeSnapshot[]> {
    requireCompanyEmployer(input.actor, input.companyId);
    const all = await this.exchanges.listByCompany(input.companyId);
    return this.mostRecentFirst(
      all.filter((exchange) => isVisibleTo(exchange, input.actor, null)),
    ).map(toCabinetExchangeSnapshot);
  }

  private mostRecentFirst(
    exchanges: readonly CabinetExchange[],
  ): CabinetExchange[] {
    return [...exchanges].sort(
      (left, right) =>
        toCabinetExchangeSnapshot(right).date.localeCompare(
          toCabinetExchangeSnapshot(left).date,
        ),
    );
  }
}
