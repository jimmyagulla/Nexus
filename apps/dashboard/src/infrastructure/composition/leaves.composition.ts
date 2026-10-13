import { LeavesPresenter } from '../../adapters/presenters/leaves/leaves.presenter';

export type LeavesComposition = {
  presenter: LeavesPresenter;
};

export function createLeavesComposition(): LeavesComposition {
  return { presenter: new LeavesPresenter() };
}
