import {
  ActorContext,
  CabinetConnection,
  CabinetExchange,
  CabinetExchangeSnapshot,
  ExchangeFilters,
  filterExchanges,
  isVisibleTo,
  requireExchangeParticipant,
  toCabinetExchangeSnapshot,
} from '@hexagonal-monorepo-template/domain';
import {
  ICabinetConnectionRepository,
  ICabinetExchangeRepository,
  IListCabinetExchanges,
} from '@hexagonal-monorepo-template/ports';

export class ListCabinetExchangesUseCase implements IListCabinetExchanges {
  constructor(
    private readonly exchanges: ICabinetExchangeRepository,
    private readonly connections: ICabinetConnectionRepository,
  ) {}

  async execute(input: {
    actor: ActorContext;
    companyId: string;
    filters?: ExchangeFilters;
  }): Promise<readonly CabinetExchangeSnapshot[]> {
    requireExchangeParticipant(input.actor, input.companyId);
    const connection = await this.connections.findByCompanyId(input.companyId);
    const visible = await this.visibleTo(input, connection);
    return this.mostRecentFirst(
      filterExchanges(visible, input.filters ?? {}),
    ).map(toCabinetExchangeSnapshot);
  }

  private async visibleTo(
    input: { actor: ActorContext; companyId: string },
    connection: CabinetConnection | null,
  ): Promise<CabinetExchange[]> {
    const all = await this.exchanges.listByCompany(input.companyId);
    return all.filter((exchange) =>
      isVisibleTo(exchange, input.actor, connection),
    );
  }

  private mostRecentFirst(
    exchanges: readonly CabinetExchange[],
  ): CabinetExchange[] {
    return [...exchanges].sort((left, right) =>
      toCabinetExchangeSnapshot(right).date.localeCompare(
        toCabinetExchangeSnapshot(left).date,
      ),
    );
  }
}
