import { ShellPresenter } from '../../adapters/presenters/shell/shell.presenter';

export type EmployeeShellComposition = {
  presenter: ShellPresenter;
};

export function createEmployeeShellComposition(): EmployeeShellComposition {
  return { presenter: new ShellPresenter() };
}
