/** A file to put in an archive. */
export type ArchiveEntry = {
  /** Name of the file inside the archive. */
  name: string;
  content: Uint8Array;
};

/** Packs files into one compressed archive. */
export interface IFileArchiver {
  /** Media type of the archives it builds, e.g. `application/zip`. */
  readonly contentType: string;
  archive(entries: readonly ArchiveEntry[]): Promise<Uint8Array>;
}

export const IFileArchiver = Symbol('IFileArchiver');
