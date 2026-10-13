import {
  ActorContext,
  CabinetExchange,
  CabinetExchangeSnapshot,
  completeExchange,
  ExchangeFile,
  ExchangeFileInput,
  requireCompanyEmployer,
  requireVisibleExchange,
  toCabinetExchangeSnapshot,
} from '@hexagonal-monorepo-template/domain';
import {
  ICabinetExchangeRepository,
  IExchangeFileStorage,
  IMarkCabinetExchangeToTransmit,
} from '@hexagonal-monorepo-template/ports';

export class MarkCabinetExchangeToTransmitUseCase
  implements IMarkCabinetExchangeToTransmit
{
  constructor(
    private readonly exchanges: ICabinetExchangeRepository,
    private readonly files: IExchangeFileStorage,
  ) {}

  async execute(input: {
    actor: ActorContext;
    companyId: string;
    exchangeId: string;
    category?: string | null;
    file?: ExchangeFileInput | null;
  }): Promise<CabinetExchangeSnapshot> {
    requireCompanyEmployer(input.actor, input.companyId);
    const draft = await requireVisibleExchange(
      input.exchangeId,
      input.actor,
      null,
      (id) => this.exchanges.findById(id),
    );
    const { exchange, file } = completeExchange(draft, input);
    const ready = exchange.markToTransmit();
    await this.keep(ready, file);
    return toCabinetExchangeSnapshot(ready);
  }

  private async keep(
    exchange: CabinetExchange,
    file: ExchangeFile | null,
  ): Promise<void> {
    if (file !== null) {
      await this.files.save(exchange.id, file);
    }
    await this.exchanges.save(exchange);
  }
}
