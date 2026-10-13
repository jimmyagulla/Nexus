import {
  ActorContext,
  CabinetConnection,
  CabinetExchange,
  CabinetExchangeSnapshot,
  ErrorCode,
  requireCompanyEmployer,
  requireVisibleExchange,
  toCabinetExchangeSnapshot,
} from '@hexagonal-monorepo-template/domain';
import {
  ICabinetConnectionRepository,
  ICabinetExchangeRepository,
  IClock,
  IExchangeFileStorage,
  ITransmitCabinetExchanges,
} from '@hexagonal-monorepo-template/ports';

export class TransmitCabinetExchangesUseCase
  implements ITransmitCabinetExchanges
{
  constructor(
    private readonly exchanges: ICabinetExchangeRepository,
    private readonly files: IExchangeFileStorage,
    private readonly connections: ICabinetConnectionRepository,
    private readonly clock: IClock,
  ) {}

  async execute(input: {
    actor: ActorContext;
    companyId: string;
    exchangeIds: readonly string[];
  }): Promise<readonly CabinetExchangeSnapshot[]> {
    requireCompanyEmployer(input.actor, input.companyId);
    this.requireAtLeastOne(input.exchangeIds);
    const pending = await this.loadPending(input.actor, input.exchangeIds);
    await this.requireDeliverable(input.companyId, pending);
    return this.deliverTogether(input.actor, pending);
  }

  private requireAtLeastOne(exchangeIds: readonly string[]): void {
    if (exchangeIds.length === 0) {
      throw new Error(ErrorCode.REQUIRED_INFORMATION);
    }
  }

  private loadPending(
    actor: ActorContext,
    exchangeIds: readonly string[],
  ): Promise<CabinetExchange[]> {
    return Promise.all(
      exchangeIds.map((id) =>
        requireVisibleExchange(id, actor, null, (found) =>
          this.exchanges.findById(found),
        ),
      ),
    );
  }

  /** Delivery needs a connected cabinet and the file of every exchange. */
  private async requireDeliverable(
    companyId: string,
    pending: readonly CabinetExchange[],
  ): Promise<void> {
    const connection = await this.connections.findByCompanyId(companyId);
    this.requireConnected(connection);
    for (const exchange of pending) {
      await this.requireFile(exchange);
    }
  }

  private requireConnected(connection: CabinetConnection | null): void {
    if (connection === null || !connection.isConnected()) {
      throw new Error(ErrorCode.TRANSMISSION_FAILED);
    }
  }

  private async requireFile(exchange: CabinetExchange): Promise<void> {
    if ((await this.files.find(exchange.id)) === null) {
      throw new Error(ErrorCode.TRANSMISSION_FAILED);
    }
  }

  private async deliverTogether(
    actor: ActorContext,
    pending: readonly CabinetExchange[],
  ): Promise<CabinetExchangeSnapshot[]> {
    const now = this.clock.now();
    const delivered = pending.map((exchange) =>
      exchange.transmit(actor.userId, now, pending.length).receive(now),
    );
    for (const exchange of delivered) {
      await this.exchanges.save(exchange);
    }
    return delivered.map(toCabinetExchangeSnapshot);
  }
}
