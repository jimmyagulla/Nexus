import { ShellPresenter } from '../../adapters/presenters/shell/shell.presenter';
import { employeeShellFixture } from '../ui/fixtures/employee-shell.fixture';
import { employerShellFixture } from '../ui/fixtures/employer-shell.fixture';

export type ShellComposition = {
  employeeShellPresenter: ShellPresenter;
  employerShellPresenter: ShellPresenter;
};

/** Presenters of the employee and employer shells, fed with placeholder data for now. */
export function createShellComposition(): ShellComposition {
  return {
    employeeShellPresenter: new ShellPresenter(employeeShellFixture),
    employerShellPresenter: new ShellPresenter(employerShellFixture),
  };
}
