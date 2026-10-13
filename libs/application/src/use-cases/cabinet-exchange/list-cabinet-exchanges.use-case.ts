import {
  ActorContext,
  CabinetConnection,
  CabinetExchange,
  CabinetExchangeSnapshot,
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
  }): Promise<readonly CabinetExchangeSnapshot[]> {
    requireExchangeParticipant(input.actor, input.companyId);
    const connection = await this.connections.findByCompanyId(input.companyId);
    const all = await this.exchanges.listByCompany(input.companyId);
    return this.mostRecentFirst(
      all.filter((exchange) => this.canSee(exchange, input.actor, connection)),
    ).map(toCabinetExchangeSnapshot);
  }

  private canSee(
    exchange: CabinetExchange,
    actor: ActorContext,
    connection: CabinetConnection | null,
  ): boolean {
    return isVisibleTo(exchange, actor, connection);
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
