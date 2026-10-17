import {
  Document,
  DocumentComment,
  DocumentName,
  DocumentProps,
} from '@hexagonal-monorepo-template/domain';
import type { Document as DocumentRecord } from '../../../infrastructure/prisma/prisma-client';

export function toDocument(row: DocumentRecord): Document {
  return new Document({
    id: row.id,
    companyId: row.companyId,
    ownerId: row.ownerId,
    uploadedById: row.uploadedById,
    name: DocumentName.parse(row.name),
    category: row.category,
    status: row.status,
    format: row.format,
    sizeBytes: row.sizeBytes,
    comment: DocumentComment.parse(row.comment),
    storageKey: row.storageKey,
    createdAt: row.createdAt,
  });
}

/** Columns of a document, from a document or a document about to be recorded. */
export function toDocumentColumns(
  document: Omit<DocumentProps, 'id'>,
): Omit<DocumentRecord, 'id'> {
  return {
    companyId: document.companyId,
    ownerId: document.ownerId,
    uploadedById: document.uploadedById,
    name: document.name.value,
    category: document.category,
    status: document.status,
    format: document.format,
    sizeBytes: document.sizeBytes,
    comment: document.comment?.value ?? null,
    storageKey: document.storageKey,
    createdAt: document.createdAt,
  };
}
