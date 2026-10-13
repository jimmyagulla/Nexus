import { GetCurrentRoleFromSessionUseCase } from '@hexagonal-monorepo-template/application';
import { ISessionGateway } from '@hexagonal-monorepo-template/ports';
import { NavigationController } from '../../adapters/controllers/navigation.controller';
import { NavigationPresenter } from '../../adapters/presenters/navigation.presenter';

export type NavigationComposition = {
  controller: NavigationController;
  presenter: NavigationPresenter;
};

export function createNavigationComposition(
  sessions: ISessionGateway,
): NavigationComposition {
  return {
    controller: new NavigationController(
      new GetCurrentRoleFromSessionUseCase(sessions),
    ),
    presenter: new NavigationPresenter(),
  };
}
