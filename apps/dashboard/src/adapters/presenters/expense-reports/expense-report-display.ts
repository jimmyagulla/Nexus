import {
  DocumentFileFormat,
  ExpenseReportCategory,
  ExpenseReportStatus,
} from '@hexagonal-monorepo-template/domain';
import type { StatusTone } from '../display.types';

/** Remix Icon class of each category, shared by the rows, the detail and the form. */
export const EXPENSE_REPORT_CATEGORY_ICONS: Readonly<Record<ExpenseReportCategory, string>> = {
  HOTEL: 'ri-hotel-bed-line',
  FUEL: 'ri-gas-station-line',
  TRAVEL: 'ri-train-line',
  PARKING: 'ri-parking-box-line',
  MEAL: 'ri-restaurant-line',
  OTHER: 'ri-receipt-line',
};

/** Order the categories are offered in: the order of the form, also used by the filters. */
export const EXPENSE_REPORT_CATEGORY_DISPLAY_ORDER: readonly ExpenseReportCategory[] = [
  'HOTEL',
  'FUEL',
  'TRAVEL',
  'PARKING',
  'MEAL',
  'OTHER',
];

/** Order the statuses are offered in by the filters: the order of the processing. */
export const EXPENSE_REPORT_STATUS_DISPLAY_ORDER: readonly ExpenseReportStatus[] = [
  'SUBMITTED',
  'IN_PROGRESS',
  'REFUNDED',
  'REJECTED',
];

export const EXPENSE_REPORT_STATUS_TONES: Readonly<Record<ExpenseReportStatus, StatusTone>> = {
  SUBMITTED: 'submitted',
  IN_PROGRESS: 'warning',
  REFUNDED: 'done',
  REJECTED: 'danger',
};

/** Remix Icon class of a receipt of each format. */
export const EXPENSE_REPORT_PROOF_ICONS: Readonly<Partial<Record<DocumentFileFormat, string>>> = {
  PDF: 'ri-file-pdf-2-line',
  JPEG: 'ri-image-line',
  PNG: 'ri-image-line',
};
