import { z } from 'zod';
import {
  detectDocumentFileFormat,
  DOCUMENT_COMMENT_MAX_LENGTH,
  DOCUMENT_MAX_FILES_PER_DEPOSIT,
  DOCUMENT_NAME_MAX_LENGTH,
  DocumentCategory,
  ErrorCode,
  isErrorCode,
  requireDocumentFileSize,
} from '@hexagonal-monorepo-template/domain';

/**
 * Checks a picked file with the rules of the API: its size first (a file too
 * large is never read), then its real format, read from its content.
 */
async function fileProblem(file: File): Promise<string | null> {
  try {
    requireDocumentFileSize(file.size);
    detectDocumentFileFormat(file.name, new Uint8Array(await file.arrayBuffer()));
    return null;
  } catch (error) {
    return error instanceof Error && isErrorCode(error.message)
      ? error.message
      : ErrorCode.UNSUPPORTED_FILE_FORMAT;
  }
}

export const documentUploadFileSchema = z
  .object({
    file: z.instanceof(File),
    name: z
      .string()
      .trim()
      .min(1, ErrorCode.REQUIRED_INFORMATION)
      .max(DOCUMENT_NAME_MAX_LENGTH, ErrorCode.INVALID_INFORMATION),
  })
  .superRefine(async ({ file }, context) => {
    const problem = await fileProblem(file);
    if (problem !== null) {
      context.addIssue({ code: 'custom', path: ['file'], message: problem });
    }
  });

export const documentUploadSchema = z.object({
  category: z.enum(DocumentCategory, ErrorCode.REQUIRED_INFORMATION),
  files: z
    .array(documentUploadFileSchema)
    .min(1, ErrorCode.REQUIRED_INFORMATION)
    .max(DOCUMENT_MAX_FILES_PER_DEPOSIT, ErrorCode.INVALID_INFORMATION),
  comment: z
    .string()
    .max(DOCUMENT_COMMENT_MAX_LENGTH, ErrorCode.INVALID_INFORMATION),
});

export type DocumentUploadValues = z.infer<typeof documentUploadSchema>;
