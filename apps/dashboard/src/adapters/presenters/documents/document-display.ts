import {
  DocumentCategory,
  DocumentStatus,
} from '@hexagonal-monorepo-template/domain';
import type { StatusTone } from '../display.types';

/** Remix Icon class of each category, shared by the list rows and the upload form. */
export const DOCUMENT_CATEGORY_ICONS: Readonly<Record<DocumentCategory, string>> = {
  SICK_LEAVE: 'ri-first-aid-kit-line',
  PROOF: 'ri-file-check-line',
  ADMINISTRATIVE: 'ri-file-text-line',
  OTHER: 'ri-file-line',
};

/** Order the categories are offered in: the order of the upload form, also used by the filters. */
export const DOCUMENT_CATEGORY_DISPLAY_ORDER: readonly DocumentCategory[] = [
  'SICK_LEAVE',
  'PROOF',
  'ADMINISTRATIVE',
  'OTHER',
];

/** Order the statuses are offered in by the filters. */
export const DOCUMENT_STATUS_DISPLAY_ORDER: readonly DocumentStatus[] = [
  'NEW',
  'SEEN',
  'PROCESSED',
  'PENDING',
];

export const DOCUMENT_STATUS_TONES: Readonly<Record<DocumentStatus, StatusTone>> = {
  NEW: 'info',
  SEEN: 'neutral',
  PROCESSED: 'done',
  PENDING: 'warning',
};
