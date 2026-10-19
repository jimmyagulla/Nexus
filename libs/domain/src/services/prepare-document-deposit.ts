import { ErrorCode } from '../errors/error-code';
import {
  DocumentCategory,
  isDocumentCategory,
} from '../value-objects/document-category';
import { DocumentComment } from '../value-objects/document-comment';
import { DocumentFileFormat } from '../value-objects/document-file-format';
import {
  DOCUMENT_MAX_FILE_SIZE_BYTES,
  DOCUMENT_MAX_FILES_PER_DEPOSIT,
} from '../value-objects/document-limits';
import { DocumentName } from '../value-objects/document-name';
import { detectDocumentFileFormat } from './detect-document-file-format';

export type DocumentDepositRequest = {
  category: string;
  comment: string | null;
  files: readonly {
    /** Name the document will carry. */
    name: string;
    /** Name of the file on the device of the person depositing it. */
    fileName: string;
    content: Uint8Array;
  }[];
};

export type DepositedFile = {
  name: DocumentName;
  fileName: string;
  format: DocumentFileFormat;
  sizeBytes: number;
  content: Uint8Array;
};

/** One deposit: one document per file, type and comment shared. */
export type DocumentDeposit = {
  category: DocumentCategory;
  comment: DocumentComment | null;
  files: readonly DepositedFile[];
};

export function prepareDocumentDeposit(
  request: DocumentDepositRequest,
): DocumentDeposit {
  const category = requireCategory(request.category);
  const comment = DocumentComment.parse(request.comment);
  requireFileCount(request.files.length);

  return {
    category,
    comment,
    files: request.files.map((file) => ({
      name: DocumentName.parse(file.name),
      fileName: file.fileName,
      sizeBytes: requireDocumentFileSize(file.content.length),
      format: detectDocumentFileFormat(file.fileName, file.content),
      content: file.content,
    })),
  };
}

/** Refuses an empty file, and a file above the size a document may carry. */
export function requireDocumentFileSize(sizeBytes: number): number {
  if (sizeBytes <= 0) {
    throw new Error(ErrorCode.REQUIRED_INFORMATION);
  }
  if (sizeBytes > DOCUMENT_MAX_FILE_SIZE_BYTES) {
    throw new Error(ErrorCode.FILE_TOO_LARGE);
  }
  return sizeBytes;
}

function requireCategory(raw: string): DocumentCategory {
  if (raw.trim() === '') {
    throw new Error(ErrorCode.REQUIRED_INFORMATION);
  }
  if (!isDocumentCategory(raw)) {
    throw new Error(ErrorCode.INVALID_INFORMATION);
  }
  return raw;
}

function requireFileCount(count: number): void {
  if (count === 0) {
    throw new Error(ErrorCode.REQUIRED_INFORMATION);
  }
  if (count > DOCUMENT_MAX_FILES_PER_DEPOSIT) {
    throw new Error(ErrorCode.INVALID_INFORMATION);
  }
}
