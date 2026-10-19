/** The receipt part of an expense report form, as the multipart parser keeps it in memory. */
export type UploadedExpenseReportProof = {
  originalname: string;
  size: number;
  buffer: Uint8Array;
};
