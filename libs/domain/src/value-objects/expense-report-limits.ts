/** Longest description an expense report may carry, in characters. */
export const EXPENSE_REPORT_DESCRIPTION_MAX_LENGTH = 250;

/** Longest project an expense report may carry, in characters. */
export const EXPENSE_REPORT_PROJECT_MAX_LENGTH = 50;

/** Largest receipt an expense report may carry: 10 MB. */
export const EXPENSE_REPORT_PROOF_MAX_SIZE_BYTES = 10 * 1024 * 1024;

/** Longest receipt file name kept, in characters. */
export const EXPENSE_REPORT_PROOF_NAME_MAX_LENGTH = 255;

/** Longest search an expense reports list accepts, in characters. */
export const EXPENSE_REPORT_SEARCH_MAX_LENGTH = 100;

/** Largest amount an expense may carry, in cents: 99 999,99 €. */
export const EXPENSE_AMOUNT_MAX_CENTS = 9_999_999;
