import { LeavesPresenter } from '../../../adapters/presenters/leaves/leaves.presenter';

export type LeavesPageComposition = {
  presenter: LeavesPresenter;
};

export function createLeavesPageComposition(): LeavesPageComposition {
  return { presenter: new LeavesPresenter() };
}
