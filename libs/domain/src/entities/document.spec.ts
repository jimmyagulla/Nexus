import { DocumentCategory } from '../value-objects/document-category';
import { DocumentEmitter } from '../value-objects/document-emitter';
import { DocumentFileFormat } from '../value-objects/document-file-format';
import { DocumentName } from '../value-objects/document-name';
import { DocumentStatus } from '../value-objects/document-status';
import { Document } from './document';

function documentWith(status: DocumentStatus, uploadedById = 'u1'): Document {
  return new Document({
    id: 'd1',
    companyId: 'c1',
    ownerId: 'u1',
    uploadedById,
    name: DocumentName.parse('Arrêt'),
    category: DocumentCategory.SICK_LEAVE,
    status,
    format: DocumentFileFormat.PDF,
    sizeBytes: 10,
    comment: null,
    storageKey: 'c1/u1/k',
    createdAt: new Date('2026-10-02T10:00:00Z'),
  });
}

function propsOf(document: Document) {
  return {
    id: document.id,
    companyId: document.companyId,
    ownerId: document.ownerId,
    uploadedById: document.uploadedById,
    name: document.name,
    category: document.category,
    status: document.status,
    format: document.format,
    sizeBytes: document.sizeBytes,
    comment: document.comment,
    storageKey: document.storageKey,
    createdAt: document.createdAt,
  };
}

describe('Document', () => {
  it.each([DocumentStatus.NEW, DocumentStatus.PENDING])(
    'is marked as seen once viewed while %s',
    (status) => {
      expect(documentWith(status).view().status).toBe(DocumentStatus.SEEN);
    },
  );

  it.each([DocumentStatus.SEEN, DocumentStatus.PROCESSED])(
    'keeps the status %s once viewed',
    (status) => {
      expect(documentWith(status).view().status).toBe(status);
    },
  );

  it('was emitted by its owner when they deposited it', () => {
    expect(documentWith(DocumentStatus.NEW).emitter).toBe(DocumentEmitter.SELF);
  });

  it('was emitted by HR when someone else deposited it', () => {
    expect(documentWith(DocumentStatus.NEW, 'hr-1').emitter).toBe(DocumentEmitter.HR);
  });

  it('is downloaded under its name, with the extension of its format', () => {
    expect(documentWith(DocumentStatus.NEW).downloadName).toBe('Arrêt.pdf');
  });

  it('keeps the extension its name already carries', () => {
    const document = documentWith(DocumentStatus.NEW);
    const named = new Document({ ...propsOf(document), name: DocumentName.parse('arret.PDF') });

    expect(named.downloadName).toBe('arret.PDF');
  });

  it('belongs to its owner within their company only', () => {
    const document = documentWith(DocumentStatus.NEW);

    expect(document.isOwnedBy('c1', 'u1')).toBe(true);
    expect(document.isOwnedBy('c2', 'u1')).toBe(false);
    expect(document.isOwnedBy('c1', 'u2')).toBe(false);
    expect(document.isOwnedBy(null, 'u1')).toBe(false);
  });
});
