import { ShellPresenter } from '../../../adapters/presenters/shell/shell.presenter';

export type EmployerShellPageComposition = {
  presenter: ShellPresenter;
};

export function createEmployerShellPageComposition(): EmployerShellPageComposition {
  return { presenter: new ShellPresenter() };
}
