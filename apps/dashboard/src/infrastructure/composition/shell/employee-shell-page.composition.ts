import { ShellPresenter } from '../../../adapters/presenters/shell/shell.presenter';

export type EmployeeShellPageComposition = {
  presenter: ShellPresenter;
};

export function createEmployeeShellPageComposition(): EmployeeShellPageComposition {
  return { presenter: new ShellPresenter() };
}
