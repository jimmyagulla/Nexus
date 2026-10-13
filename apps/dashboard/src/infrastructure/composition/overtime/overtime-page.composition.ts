import { OvertimePresenter } from '../../../adapters/presenters/overtime/overtime.presenter';

export type OvertimePageComposition = {
  presenter: OvertimePresenter;
};

export function createOvertimePageComposition(): OvertimePageComposition {
  return { presenter: new OvertimePresenter() };
}
