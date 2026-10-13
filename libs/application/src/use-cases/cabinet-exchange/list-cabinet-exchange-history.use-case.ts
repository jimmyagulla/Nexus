import {
  ActorContext,
  CabinetConnection,
  CabinetExchange,
  ErrorCode,
  ExchangeHistoryEntry,
  isInHistoryOf,
  requireExchangeParticipant,
  toExchangeHistoryEntries,
} from '@hexagonal-monorepo-template/domain';
import {
  ICabinetConnectionRepository,
  ICabinetExchangeRepository,
  IListCabinetExchangeHistory,
} from '@hexagonal-monorepo-template/ports';

export class ListCabinetExchangeHistoryUseCase
  implements IListCabinetExchangeHistory
{
  constructor(
    private readonly exchanges: ICabinetExchangeRepository,
    private readonly connections: ICabinetConnectionRepository,
  ) {}

  async execute(input: {
    actor: ActorContext;
    companyId: string;
    exchangeId?: string | null;
  }): Promise<readonly ExchangeHistoryEntry[]> {
    requireExchangeParticipant(input.actor, input.companyId);
    const connection = await this.connections.findByCompanyId(input.companyId);
    const told = await this.exchangesToTell(input, connection);
    return this.mostRecentFirst(told.flatMap(toExchangeHistoryEntries));
  }

  private async exchangesToTell(
    input: { actor: ActorContext; companyId: string; exchangeId?: string | null },
    connection: CabinetConnection | null,
  ): Promise<CabinetExchange[]> {
    if (input.exchangeId !== undefined && input.exchangeId !== null) {
      return [await this.requireInHistory(input.exchangeId, input.actor, connection)];
    }
    const all = await this.exchanges.listByCompany(input.companyId);
    return all.filter((exchange) =>
      isInHistoryOf(exchange, input.actor, connection),
    );
  }

  private async requireInHistory(
    exchangeId: string,
    actor: ActorContext,
    connection: CabinetConnection | null,
  ): Promise<CabinetExchange> {
    const exchange = await this.exchanges.findById(exchangeId);
    if (exchange === null || !isInHistoryOf(exchange, actor, connection)) {
      throw new Error(ErrorCode.INACCESSIBLE_DOCUMENT);
    }
    return exchange;
  }

  private mostRecentFirst(
    entries: ExchangeHistoryEntry[],
  ): ExchangeHistoryEntry[] {
    return [...entries].sort((left, right) =>
      right.occurredAt.localeCompare(left.occurredAt),
    );
  }
}
