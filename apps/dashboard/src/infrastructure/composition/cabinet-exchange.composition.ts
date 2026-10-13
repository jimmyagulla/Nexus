import {
  CreateCabinetExchangeDraftFromSessionUseCase,
  DepositCabinetExchangeFromSessionUseCase,
  DownloadCabinetExchangeFileFromSessionUseCase,
  ListCabinetExchangeHistoryFromSessionUseCase,
  ListCabinetExchangesFromSessionUseCase,
  MarkCabinetExchangeToTransmitFromSessionUseCase,
  OpenCabinetExchangeFromSessionUseCase,
  TransmitCabinetExchangesFromSessionUseCase,
} from '@hexagonal-monorepo-template/application';
import { ApiCabinetExchangeGateway } from '@hexagonal-monorepo-template/adapters';
import {
  IHttpClient,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';
import { CabinetExchangeController } from '../../adapters/controllers/cabinet-exchange.controller';
import { CabinetExchangeHistoryPresenter } from '../../adapters/presenters/cabinet-exchange-history.presenter';
import { CabinetExchangePresenter } from '../../adapters/presenters/cabinet-exchange.presenter';
import { ErrorPresenter } from '../../adapters/presenters/error.presenter';

export type CabinetExchangeComposition = {
  controller: CabinetExchangeController;
  presenter: CabinetExchangePresenter;
  historyPresenter: CabinetExchangeHistoryPresenter;
  errorPresenter: ErrorPresenter;
};

export function createCabinetExchangeComposition(
  httpClient: IHttpClient,
  sessions: ISessionGateway,
): CabinetExchangeComposition {
  const exchanges = new ApiCabinetExchangeGateway(httpClient);

  return {
    controller: new CabinetExchangeController(
      new CreateCabinetExchangeDraftFromSessionUseCase(sessions, exchanges),
      new MarkCabinetExchangeToTransmitFromSessionUseCase(sessions, exchanges),
      new TransmitCabinetExchangesFromSessionUseCase(sessions, exchanges),
      new ListCabinetExchangesFromSessionUseCase(sessions, exchanges),
      new OpenCabinetExchangeFromSessionUseCase(sessions, exchanges),
      new DownloadCabinetExchangeFileFromSessionUseCase(sessions, exchanges),
      new DepositCabinetExchangeFromSessionUseCase(sessions, exchanges),
      new ListCabinetExchangeHistoryFromSessionUseCase(sessions, exchanges),
    ),
    presenter: new CabinetExchangePresenter(),
    historyPresenter: new CabinetExchangeHistoryPresenter(),
    errorPresenter: new ErrorPresenter(),
  };
}
