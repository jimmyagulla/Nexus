import { zipSync, type Zippable } from 'fflate';
import {
  ArchiveEntry,
  IFileArchiver,
} from '@hexagonal-monorepo-template/ports';

/** Packs files into a ZIP archive. The only file calling the ZIP library. */
export class ZipFileArchiver implements IFileArchiver {
  readonly contentType = 'application/zip';

  /** Entry names are expected distinct: a repeated name keeps its last file only. */
  async archive(entries: readonly ArchiveEntry[]): Promise<Uint8Array> {
    const files: Zippable = Object.fromEntries(
      entries.map((entry) => [entry.name, entry.content]),
    );
    return zipSync(files);
  }
}
