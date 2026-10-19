import {
  IHttpClient,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';
import type { SeenItemsStore } from '../../ui/stores/seen-items.store';
import {
  createPayslipsPageComposition,
  type PayslipsPageComposition,
} from './payslips-page.composition';
import {
  createPayslipPageComposition,
  type PayslipPageComposition,
} from './payslip-page.composition';

/** Compositions of the payslip pages. */
export type PayslipComposition = {
  payslips: PayslipsPageComposition;
  payslip: PayslipPageComposition;
};

export function createPayslipComposition(
  httpClient: IHttpClient,
  sessions: ISessionGateway,
  seenPayslips: SeenItemsStore,
): PayslipComposition {
  return {
    payslips: createPayslipsPageComposition(httpClient, sessions, seenPayslips),
    payslip: createPayslipPageComposition(),
  };
}
