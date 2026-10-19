import type { FileLink } from '@hexagonal-monorepo-template/domain';

/** A file read for the in-app viewer. */
export interface FilePreview {
  /** Local URL of the file; revoke it once the viewer closes. */
  objectUrl: string;
  fileName: string;
  contentType: string;
  /** Content of a text file (CSV), null otherwise. */
  text: string | null;
}

/** Readies a file read behind a link for the in-app viewer. */
export async function previewOf(file: Blob, link: FileLink): Promise<FilePreview> {
  return {
    objectUrl: URL.createObjectURL(file),
    fileName: link.fileName,
    contentType: link.contentType,
    text: link.contentType.startsWith('text/') ? await file.text() : null,
  };
}
