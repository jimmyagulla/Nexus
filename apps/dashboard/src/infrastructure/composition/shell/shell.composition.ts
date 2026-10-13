import {
  createEmployeeShellPageComposition,
  type EmployeeShellPageComposition,
} from './employee-shell-page.composition';
import {
  createEmployerShellPageComposition,
  type EmployerShellPageComposition,
} from './employer-shell-page.composition';

/** Compositions of the shell pages. */
export type ShellComposition = {
  employeeShell: EmployeeShellPageComposition;
  employerShell: EmployerShellPageComposition;
};

export function createShellComposition(): ShellComposition {
  return {
    employeeShell: createEmployeeShellPageComposition(),
    employerShell: createEmployerShellPageComposition(),
  };
}
