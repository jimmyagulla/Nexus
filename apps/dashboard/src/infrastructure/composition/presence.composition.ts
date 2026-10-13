import {
  ListPresencesFromSessionUseCase,
  OpenPresenceFromSessionUseCase,
} from '@hexagonal-monorepo-template/application';
import { ApiPresenceGateway } from '@hexagonal-monorepo-template/adapters';
import {
  IHttpClient,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';
import { PresenceController } from '../../adapters/controllers/presence.controller';
import { ErrorPresenter } from '../../adapters/presenters/error.presenter';
import { PresencePresenter } from '../../adapters/presenters/presence.presenter';

export type PresenceComposition = {
  controller: PresenceController;
  presenter: PresencePresenter;
  errorPresenter: ErrorPresenter;
};

export function createPresenceComposition(
  httpClient: IHttpClient,
  sessions: ISessionGateway,
): PresenceComposition {
  const presences = new ApiPresenceGateway(httpClient);

  return {
    controller: new PresenceController(
      new ListPresencesFromSessionUseCase(sessions, presences),
      new OpenPresenceFromSessionUseCase(sessions, presences),
    ),
    presenter: new PresencePresenter(),
    errorPresenter: new ErrorPresenter(),
  };
}
