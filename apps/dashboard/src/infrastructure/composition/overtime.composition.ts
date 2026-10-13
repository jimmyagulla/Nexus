import { OvertimePresenter } from '../../adapters/presenters/overtime/overtime.presenter';

export type OvertimeComposition = {
  presenter: OvertimePresenter;
};

export function createOvertimeComposition(): OvertimeComposition {
  return { presenter: new OvertimePresenter() };
}
