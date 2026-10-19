import { Document } from '../entities/document';
import { DocumentCategory } from '../value-objects/document-category';
import { DocumentEmitter } from '../value-objects/document-emitter';
import { DocumentFileFormat } from '../value-objects/document-file-format';
import { DocumentStatus } from '../value-objects/document-status';

/** Metadata of a document, as a list shows it. Never the file itself. */
export type DocumentSummary = {
  id: string;
  name: string;
  category: DocumentCategory;
  status: DocumentStatus;
  format: DocumentFileFormat;
  sizeBytes: number;
  emitter: DocumentEmitter;
  comment: string | null;
  /** ISO 8601 instant. */
  createdAt: string;
};

export function toDocumentSummary(document: Document): DocumentSummary {
  return {
    id: document.id,
    name: document.name.value,
    category: document.category,
    status: document.status,
    format: document.format,
    sizeBytes: document.sizeBytes,
    emitter: document.emitter,
    comment: document.comment?.value ?? null,
    createdAt: document.createdAt.toISOString(),
  };
}
