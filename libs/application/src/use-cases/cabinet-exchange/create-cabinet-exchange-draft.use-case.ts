import {
  ActorContext,
  CabinetExchange,
  CabinetExchangeSnapshot,
  completeExchange,
  ExchangeFile,
  ExchangeFileInput,
  requireCompanyEmployer,
  toCabinetExchangeSnapshot,
} from '@hexagonal-monorepo-template/domain';
import {
  ICabinetExchangeRepository,
  IClock,
  ICreateCabinetExchangeDraft,
  IExchangeFileStorage,
} from '@hexagonal-monorepo-template/ports';

export class CreateCabinetExchangeDraftUseCase
  implements ICreateCabinetExchangeDraft
{
  constructor(
    private readonly exchanges: ICabinetExchangeRepository,
    private readonly files: IExchangeFileStorage,
    private readonly clock: IClock,
  ) {}

  async execute(input: {
    actor: ActorContext;
    companyId: string;
    category?: string | null;
    file?: ExchangeFileInput | null;
  }): Promise<CabinetExchangeSnapshot> {
    requireCompanyEmployer(input.actor, input.companyId);
    const { exchange, file } = completeExchange(
      this.startDraft(input.actor, input.companyId),
      input,
    );
    await this.keep(exchange, file);
    return toCabinetExchangeSnapshot(exchange);
  }

  private startDraft(actor: ActorContext, companyId: string): CabinetExchange {
    return CabinetExchange.draft(
      this.exchanges.nextId(),
      companyId,
      actor.userId,
      this.clock.now(),
    );
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
