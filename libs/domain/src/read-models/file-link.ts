/** Link to a stored file, valid for a short while. */
export type FileLink = {
  url: string;
  /** Name to save the file under, extension included. */
  fileName: string;
  contentType: string;
};
