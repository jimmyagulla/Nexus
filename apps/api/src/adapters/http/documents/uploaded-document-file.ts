/** A file part of a deposit, as the multipart parser keeps it in memory. */
export type UploadedDocumentFile = {
  originalname: string;
  size: number;
  buffer: Uint8Array;
};
