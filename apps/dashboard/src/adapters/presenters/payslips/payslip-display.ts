import type { StatusTone } from '../display.types';

/** Whether the employee has opened or downloaded a payslip yet. */
export type PayslipReadState = 'NEW' | 'SEEN';

export const PAYSLIP_READ_STATE_TONES: Readonly<Record<PayslipReadState, StatusTone>> = {
  NEW: 'info',
  SEEN: 'neutral',
};
