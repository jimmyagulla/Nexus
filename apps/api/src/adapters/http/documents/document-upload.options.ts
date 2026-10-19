import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import {
  DOCUMENT_COMMENT_MAX_LENGTH,
  DOCUMENT_MAX_FILE_SIZE_BYTES,
  DOCUMENT_MAX_FILES_PER_DEPOSIT,
} from '@hexagonal-monorepo-template/domain';

/** Multipart field carrying the files of a deposit. */
export const DOCUMENT_FILES_FIELD = 'files';

/**
 * The parser stops reading as soon as a limit is crossed, so an oversized
 * file is refused (413) before it is fully received, never buffered whole.
 */
export const DOCUMENT_UPLOAD_OPTIONS: MulterOptions = {
  defParamCharset: 'utf8',
  limits: {
    fileSize: DOCUMENT_MAX_FILE_SIZE_BYTES,
    files: DOCUMENT_MAX_FILES_PER_DEPOSIT,
    // category, comment and one name per file
    fields: 2 + DOCUMENT_MAX_FILES_PER_DEPOSIT,
    // UTF-8 may take up to 4 bytes per character
    fieldSize: DOCUMENT_COMMENT_MAX_LENGTH * 4,
    parts: 2 + 2 * DOCUMENT_MAX_FILES_PER_DEPOSIT,
  },
};
