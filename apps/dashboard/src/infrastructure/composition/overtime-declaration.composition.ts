import { OvertimeDeclarationPresenter } from '../../adapters/presenters/overtime/overtime-declaration.presenter';

export type OvertimeDeclarationComposition = {
  presenter: OvertimeDeclarationPresenter;
};

export function createOvertimeDeclarationComposition(): OvertimeDeclarationComposition {
  return { presenter: new OvertimeDeclarationPresenter() };
}
