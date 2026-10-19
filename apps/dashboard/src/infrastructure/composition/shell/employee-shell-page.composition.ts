import {
  IHttpClient,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';
import { ShellPresenter } from '../../../adapters/presenters/shell/shell.presenter';
import type { SeenPayslipsStore } from '../../ui/stores/seen-payslips.store';
import { createPayslipsController } from '../payslip/payslips-controller.composition';
import type { PayslipsPageComposition } from '../payslip/payslips-page.composition';

export type EmployeeShellPageComposition = {
  presenter: ShellPresenter;
  /** What the badge of unseen payslips reads. */
  payslips: Pick<PayslipsPageComposition, 'controller' | 'seenPayslips'>;
};

export function createEmployeeShellPageComposition(
  httpClient: IHttpClient,
  sessions: ISessionGateway,
  seenPayslips: SeenPayslipsStore,
): EmployeeShellPageComposition {
  return {
    presenter: new ShellPresenter(),
    payslips: { controller: createPayslipsController(httpClient, sessions), seenPayslips },
  };
}
