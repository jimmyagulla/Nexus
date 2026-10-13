import {
  ActorContext,
  CabinetExchange,
  CabinetExchangeSnapshot,
  isRecipient,
  requireExchangeParticipant,
  requireVisibleExchange,
  toCabinetExchangeSnapshot,
} from '@hexagonal-monorepo-template/domain';
import {
  ICabinetConnectionRepository,
  ICabinetExchangeRepository,
  IClock,
  IOpenCabinetExchange,
} from '@hexagonal-monorepo-template/ports';

export class OpenCabinetExchangeUseCase implements IOpenCabinetExchange {
  constructor(
    private readonly exchanges: ICabinetExchangeRepository,
    private readonly connections: ICabinetConnectionRepository,
    private readonly clock: IClock,
  ) {}

  async execute(input: {
    actor: ActorContext;
    companyId: string;
    exchangeId: string;
  }): Promise<CabinetExchangeSnapshot> {
    requireExchangeParticipant(input.actor, input.companyId);
    const found = await this.loadVisible(input);
    const opened = await this.recordConsultationByRecipient(found, input.actor);
    return toCabinetExchangeSnapshot(opened);
  }

  private async loadVisible(input: {
    actor: ActorContext;
    companyId: string;
    exchangeId: string;
  }): Promise<CabinetExchange> {
    const connection = await this.connections.findByCompanyId(input.companyId);
    return requireVisibleExchange(
      input.exchangeId,
      input.actor,
      connection,
      (id) => this.exchanges.findById(id),
    );
  }

  private async recordConsultationByRecipient(
    exchange: CabinetExchange,
    actor: ActorContext,
  ): Promise<CabinetExchange> {
    if (!isRecipient(exchange, actor)) {
      return exchange;
    }
    const consulted = exchange.consult(actor.userId, this.clock.now());
    await this.exchanges.save(consulted);
    return consulted;
  }
}
