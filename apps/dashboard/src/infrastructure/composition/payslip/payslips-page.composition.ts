import { ZipFileArchiver } from '@hexagonal-monorepo-template/adapters';
import {
  IFileArchiver,
  IHttpClient,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';
import { PayslipsController } from '../../../adapters/controllers/payslips.controller';
import { CountLabelPresenter } from '../../../adapters/presenters/documents/count-label.presenter';
import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { PayslipArchiveNamePresenter } from '../../../adapters/presenters/payslips/payslip-archive-name.presenter';
import { PayslipListSummaryPresenter } from '../../../adapters/presenters/payslips/payslip-list-summary.presenter';
import { PayslipRowPresenter } from '../../../adapters/presenters/payslips/payslip-row.presenter';
import { PayslipYearPresenter } from '../../../adapters/presenters/payslips/payslip-year.presenter';
import { RemoteFileReader } from '../../network/remote-file-reader';
import type { SeenItemsStore } from '../../ui/stores/seen-items.store';
import { createPayslipsController } from './payslips-controller.composition';

/** Presenters of the payslips list: one per view model. */
export type PayslipsListPresenters = {
  summary: PayslipListSummaryPresenter;
  year: PayslipYearPresenter;
  row: PayslipRowPresenter;
};

export type PayslipsPageComposition = {
  controller: PayslipsController;
  listPresenters: PayslipsListPresenters;
  archiveName: PayslipArchiveNamePresenter;
  errorPresenter: ErrorPresenter;
  /** Reads the file behind the link of a viewed, downloaded or exported payslip. */
  files: RemoteFileReader;
  /** Packs the payslips of a year into the archive "Tout télécharger" saves. */
  archiver: IFileArchiver;
  /** Payslips opened or downloaded on this device. */
  seenPayslips: SeenItemsStore;
};

export function createPayslipsPageComposition(
  httpClient: IHttpClient,
  sessions: ISessionGateway,
  seenPayslips: SeenItemsStore,
): PayslipsPageComposition {
  const counts = new CountLabelPresenter();

  return {
    controller: createPayslipsController(httpClient, sessions),
    listPresenters: {
      summary: new PayslipListSummaryPresenter(counts),
      year: new PayslipYearPresenter(counts),
      row: new PayslipRowPresenter(),
    },
    archiveName: new PayslipArchiveNamePresenter(),
    errorPresenter: new ErrorPresenter(),
    files: new RemoteFileReader(httpClient),
    archiver: new ZipFileArchiver(),
    seenPayslips,
  };
}
