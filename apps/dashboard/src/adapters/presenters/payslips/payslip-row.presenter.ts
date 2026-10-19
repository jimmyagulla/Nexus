import { PayslipSummary } from '@hexagonal-monorepo-template/domain';
import {
  i18n as appI18n,
  type I18n,
} from '../../../infrastructure/ui/i18n/i18n';
import type { StatusViewModel } from '../display.types';
import { PAYSLIP_READ_STATE_TONES, type PayslipReadState } from './payslip-display';

export interface PayslipRowModel {
  id: string;
  /** "Septembre 2026" */
  period: string;
  /** `jj/mm/aaaa` */
  availableOn: string;
  status: StatusViewModel;
  /** Neither opened nor downloaded yet: the row stands out. */
  isNew: boolean;
}

/** Presents one row of the payslips list. */
export class PayslipRowPresenter {
  constructor(private readonly i18n: I18n = appI18n) {}

  /** `seen`: the employee already opened or downloaded it. */
  present(item: PayslipSummary, seen: boolean): PayslipRowModel {
    const state: PayslipReadState = seen ? 'SEEN' : 'NEW';
    return {
      id: item.id,
      period: this.presentPeriod(item.year, item.month),
      availableOn: this.presentDate(new Date(item.availableAt)),
      status: {
        label: this.i18n.messages.payslips.list.statuses[state],
        tone: PAYSLIP_READ_STATE_TONES[state],
      },
      isNew: !seen,
    };
  }

  private presentPeriod(year: number, month: number): string {
    const months = this.i18n.messages.payslips.months;
    return `${months[month as keyof typeof months]} ${year}`;
  }

  /** `jj/mm/aaaa`, in the time zone of the device. */
  private presentDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}/${date.getFullYear()}`;
  }
}
