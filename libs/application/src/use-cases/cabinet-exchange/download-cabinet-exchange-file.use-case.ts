import {
  ActorContext,
  CabinetExchange,
  ErrorCode,
  ExchangeFile,
  ExchangeFileInput,
  isRecipient,
  requireExchangeParticipant,
  requireVisibleExchange,
} from '@hexagonal-monorepo-template/domain';
import {
  ICabinetConnectionRepository,
  ICabinetExchangeRepository,
  IClock,
  IDownloadCabinetExchangeFile,
  IExchangeFileStorage,
} from '@hexagonal-monorepo-template/ports';

export class DownloadCabinetExchangeFileUseCase
  implements IDownloadCabinetExchangeFile
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
    exchangeId: string;
  }): Promise<ExchangeFileInput> {
    requireExchangeParticipant(input.actor, input.companyId);
    const exchange = await this.loadVisible(input);
    const file = await this.loadFile(exchange);
    await this.recordDownloadByRecipient(exchange, input.actor);
    return {
      fileName: file.fileName,
      mimeType: file.mimeType,
      content: file.content,
    };
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

  private async loadFile(exchange: CabinetExchange): Promise<ExchangeFile> {
    const file = await this.files.find(exchange.id);
    if (file === null) {
      throw new Error(ErrorCode.INACCESSIBLE_DOCUMENT);
    }
    return file;
  }

  private async recordDownloadByRecipient(
    exchange: CabinetExchange,
    actor: ActorContext,
  ): Promise<void> {
    if (isRecipient(exchange, actor)) {
      await this.exchanges.save(
        exchange.download(actor.userId, this.clock.now()),
      );
    }
  }
}
