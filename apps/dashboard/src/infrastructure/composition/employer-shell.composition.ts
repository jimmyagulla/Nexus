import { ShellPresenter } from '../../adapters/presenters/shell/shell.presenter';

export type EmployerShellComposition = {
  presenter: ShellPresenter;
};

export function createEmployerShellComposition(): EmployerShellComposition {
  return { presenter: new ShellPresenter() };
}
