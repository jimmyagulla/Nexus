import {
  IHttpClient,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';
import type { SeenPayslipsStore } from '../../ui/stores/seen-payslips.store';
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

export function createShellComposition(
  httpClient: IHttpClient,
  sessions: ISessionGateway,
  seenPayslips: SeenPayslipsStore,
): ShellComposition {
  return {
    employeeShell: createEmployeeShellPageComposition(httpClient, sessions, seenPayslips),
    employerShell: createEmployerShellPageComposition(),
  };
}
