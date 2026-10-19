import {
  defaultPayslipYear,
  PayslipFileLink,
  PayslipList,
  PayslipListCriteria,
} from '@hexagonal-monorepo-template/domain';
import {
  IClock,
  IDownloadPayslipFromSession,
  IExportPayslipsFromSession,
  IListPayslipsFromSession,
  IViewPayslipFromSession,
} from '@hexagonal-monorepo-template/ports';

/**
 * What the payslips screen shows, as the person sets it: the year of the
 * domain criteria, but null means "not chosen yet" (the screen then opens on
 * its default year) instead of "every year".
 */
export type PayslipsListState = {
  year: PayslipListCriteria['year'];
};

/** The criteria of a screen showing one year, never every year at once. */
export type PayslipYearCriteria = {
  year: NonNullable<PayslipListCriteria['year']>;
};

/** Every payslip of the employee: what the counters and the year picker read. */
export const EVERY_PAYSLIP: PayslipListCriteria = { year: null };

export class PayslipsController {
  constructor(
    private readonly listFromSession: IListPayslipsFromSession,
    private readonly viewFromSession: IViewPayslipFromSession,
    private readonly downloadFromSession: IDownloadPayslipFromSession,
    private readonly exportFromSession: IExportPayslipsFromSession,
    private readonly clock: IClock,
  ) {}

  /**
   * The criteria a state asks for; also the cache key of the list. `years`
   * are those the employee has a payslip in, undefined while they load: the
   * default year is then not known yet (null) unless a year was chosen.
   */
  criteriaFor(
    state: PayslipsListState,
    years: readonly number[] | undefined,
  ): PayslipYearCriteria | null {
    if (state.year !== null) {
      return { year: state.year };
    }
    return years === undefined ? null : { year: defaultPayslipYear(years, this.clock.now()) };
  }

  listPayslips(criteria: PayslipListCriteria): Promise<PayslipList> {
    return this.listFromSession.execute(criteria);
  }

  viewPayslip(payslipId: string): Promise<PayslipFileLink> {
    return this.viewFromSession.execute(payslipId);
  }

  downloadPayslip(payslipId: string): Promise<PayslipFileLink> {
    return this.downloadFromSession.execute(payslipId);
  }

  /** The download links of every payslip the list shows. */
  exportPayslips(criteria: PayslipListCriteria): Promise<PayslipFileLink[]> {
    return this.exportFromSession.execute(criteria);
  }
}
