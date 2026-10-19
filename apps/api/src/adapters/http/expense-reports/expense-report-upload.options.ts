import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import {
  EXPENSE_REPORT_DESCRIPTION_MAX_LENGTH,
  EXPENSE_REPORT_PROOF_MAX_SIZE_BYTES,
} from '@hexagonal-monorepo-template/domain';

/** Multipart field carrying the receipt of an expense report. */
export const EXPENSE_REPORT_PROOF_FIELD = 'proof';

/** Text fields of an expense report form, `keepProof` included. */
const TEXT_FIELDS = 8;

/**
 * The parser stops reading as soon as a limit is crossed, so an oversized
 * receipt is refused (413) before it is fully received, never buffered whole.
 */
export const EXPENSE_REPORT_UPLOAD_OPTIONS: MulterOptions = {
  defParamCharset: 'utf8',
  limits: {
    fileSize: EXPENSE_REPORT_PROOF_MAX_SIZE_BYTES,
    files: 1,
    fields: TEXT_FIELDS,
    // UTF-8 may take up to 4 bytes per character
    fieldSize: EXPENSE_REPORT_DESCRIPTION_MAX_LENGTH * 4,
    // the text fields and the receipt; the parser refuses the part that reaches the limit
    parts: TEXT_FIELDS + 2,
  },
};
