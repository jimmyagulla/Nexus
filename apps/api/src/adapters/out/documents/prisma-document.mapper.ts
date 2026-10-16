import {
  Document,
  DocumentCategory,
  DocumentComment,
  DocumentFileFormat,
  DocumentName,
  DocumentProps,
  DocumentStatus,
} from '@hexagonal-monorepo-template/domain';

export type PrismaDocumentRow = {
  id: string;
  companyId: string;
  ownerId: string;
  uploadedById: string;
  name: string;
  category: DocumentCategory;
  status: DocumentStatus;
  format: DocumentFileFormat;
  sizeBytes: number;
  comment: string | null;
  storageKey: string;
  createdAt: Date;
};

export function toDocument(row: PrismaDocumentRow): Document {
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
): Omit<PrismaDocumentRow, 'id'> {
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
