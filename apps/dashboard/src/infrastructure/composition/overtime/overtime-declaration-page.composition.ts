import { OvertimeDeclarationPresenter } from '../../../adapters/presenters/overtime/overtime-declaration.presenter';

export type OvertimeDeclarationPageComposition = {
  presenter: OvertimeDeclarationPresenter;
};

export function createOvertimeDeclarationPageComposition(): OvertimeDeclarationPageComposition {
  return { presenter: new OvertimeDeclarationPresenter() };
}
