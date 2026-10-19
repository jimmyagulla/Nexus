import {
  IHttpClient,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';
import {
  createEmployeeShellPageComposition,
  type EmployeeShellPageComposition,
  type SeenStores,
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

export function createShellComposition(
  httpClient: IHttpClient,
  sessions: ISessionGateway,
  seen: SeenStores,
): ShellComposition {
  return {
    employeeShell: createEmployeeShellPageComposition(httpClient, sessions, seen),
    employerShell: createEmployerShellPageComposition(),
  };
}
