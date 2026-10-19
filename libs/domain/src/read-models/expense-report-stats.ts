/** Key figures of one owner's expense reports, whatever the criteria of the list. */
export type ExpenseReportStats = {
  /** Reports waiting for their refund: submitted or being processed. */
  pending: { count: number; amount: string };
  /** Refunded during the current year. */
  refunded: { year: number; amount: string };
  /** Mean days from submission to refund or refusal; null before any is processed. */
  averageProcessingDays: number | null;
};
