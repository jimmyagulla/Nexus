import { ExchangeFileInput } from '@hexagonal-monorepo-template/domain';

export interface IDownloadCabinetExchangeFileFromSession {
  execute(exchangeId: string): Promise<ExchangeFileInput>;
}

export const IDownloadCabinetExchangeFileFromSession = Symbol(
  'IDownloadCabinetExchangeFileFromSession',
);
