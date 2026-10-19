import {
  IHttpClient,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';
import { ShellPresenter } from '../../../adapters/presenters/shell/shell.presenter';
import type { SeenItemsStore } from '../../ui/stores/seen-items.store';
import { createDocumentsController } from '../document/documents-controller.composition';
import type { DocumentsPageComposition } from '../document/documents-page.composition';
import { createPayslipsController } from '../payslip/payslips-controller.composition';
import type { PayslipsPageComposition } from '../payslip/payslips-page.composition';

/** What the device keeps as opened or downloaded, per kind of item. */
export type SeenStores = {
  payslips: SeenItemsStore;
  documents: SeenItemsStore;
};

export type EmployeeShellPageComposition = {
  presenter: ShellPresenter;
  /** What the badge of unseen payslips reads. */
  payslips: Pick<PayslipsPageComposition, 'controller' | 'seenPayslips'>;
  /** What the badge of unseen documents reads. */
  documents: Pick<DocumentsPageComposition, 'controller' | 'seenDocuments'>;
};

export function createEmployeeShellPageComposition(
  httpClient: IHttpClient,
  sessions: ISessionGateway,
  seen: SeenStores,
): EmployeeShellPageComposition {
  return {
    presenter: new ShellPresenter(),
    payslips: {
      controller: createPayslipsController(httpClient, sessions),
      seenPayslips: seen.payslips,
    },
    documents: {
      controller: createDocumentsController(httpClient, sessions),
      seenDocuments: seen.documents,
    },
  };
}
