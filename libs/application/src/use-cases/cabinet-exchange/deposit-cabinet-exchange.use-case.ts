import {
  ActorContext,
  CabinetExchange,
  CabinetExchangeSnapshot,
  ErrorCode,
  ExchangeCategory,
  ExchangeFile,
  ExchangeFileInput,
  Notification,
  requireConnectedCabinet,
  toCabinetExchangeSnapshot,
} from '@hexagonal-monorepo-template/domain';
import {
  ICabinetConnectionRepository,
  ICabinetExchangeRepository,
  IClock,
  IDepositCabinetExchange,
  IExchangeFileStorage,
  INotificationRepository,
} from '@hexagonal-monorepo-template/ports';

export class DepositCabinetExchangeUseCase implements IDepositCabinetExchange {
  constructor(
    private readonly exchanges: ICabinetExchangeRepository,
    private readonly files: IExchangeFileStorage,
    private readonly connections: ICabinetConnectionRepository,
    private readonly notifications: INotificationRepository,
    private readonly clock: IClock,
  ) {}

  async execute(input: {
    actor: ActorContext;
    companyId: string;
    category: string;
    file: ExchangeFileInput | null;
  }): Promise<CabinetExchangeSnapshot> {
    await this.requireOpenCabinet(input.actor, input.companyId);
    const category = ExchangeCategory.parse(input.category);
    const file = this.requireFile(input.file);
    const received = this.depositAndDeliver(input, category, file);
    await this.keep(received, file);
    await this.tellTheCompany(received);
    return toCabinetExchangeSnapshot(received);
  }

  private async requireOpenCabinet(
    actor: ActorContext,
    companyId: string,
  ): Promise<void> {
    requireConnectedCabinet(
      actor,
      companyId,
      await this.connections.findByCompanyId(companyId),
    );
  }

  private requireFile(raw: ExchangeFileInput | null): ExchangeFile {
    if (raw === null) {
      throw new Error(ErrorCode.MISSING_DOCUMENT);
    }
    return ExchangeFile.of(raw.fileName, raw.mimeType, raw.content);
  }

  /** The deposit is Transmitted, then Received as soon as the company can see it. */
  private depositAndDeliver(
    input: { actor: ActorContext; companyId: string },
    category: ExchangeCategory,
    file: ExchangeFile,
  ): CabinetExchange {
    const now = this.clock.now();
    return CabinetExchange.deposit(
      this.exchanges.nextId(),
      input.companyId,
      input.actor.userId,
      category,
      file,
      now,
    ).receive(now);
  }

  private tellTheCompany(received: CabinetExchange): Promise<void> {
    return this.notifications.save(
      Notification.exchangeReceived(
        this.notifications.nextId(),
        received,
        received.date(),
      ),
    );
  }

  private async keep(
    exchange: CabinetExchange,
    file: ExchangeFile,
  ): Promise<void> {
    await this.files.save(exchange.id, file);
    await this.exchanges.save(exchange);
  }
}
