import { OvertimeDeclarationPresenter } from '../../adapters/presenters/overtime/overtime-declaration.presenter';
import { OvertimePresenter } from '../../adapters/presenters/overtime/overtime.presenter';
import { overtimeDeclarationFixture, overtimeFixture } from '../ui/fixtures/overtime.fixture';

export type OvertimeComposition = {
  overtimePresenter: OvertimePresenter;
  overtimeDeclarationPresenter: OvertimeDeclarationPresenter;
};

/** Presenters of the overtime screens, fed with placeholder data for now. */
export function createOvertimeComposition(): OvertimeComposition {
  return {
    overtimePresenter: new OvertimePresenter(overtimeFixture),
    overtimeDeclarationPresenter: new OvertimeDeclarationPresenter(overtimeDeclarationFixture),
  };
}
