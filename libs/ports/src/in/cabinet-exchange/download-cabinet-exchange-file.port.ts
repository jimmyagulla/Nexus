import {
  ActorContext,
  ExchangeFileInput,
} from '@hexagonal-monorepo-template/domain';

export interface IDownloadCabinetExchangeFile {
  execute(input: {
    actor: ActorContext;
    companyId: string;
    exchangeId: string;
  }): Promise<ExchangeFileInput>;
}

export const IDownloadCabinetExchangeFile = Symbol(
  'IDownloadCabinetExchangeFile',
);
