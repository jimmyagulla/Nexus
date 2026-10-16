import { describe, expect, it } from 'vitest';
import {
  DocumentCategory,
  DocumentFileFormat,
  DocumentListCriteria,
  DocumentName,
  DocumentSort,
  DocumentStatus,
} from '@hexagonal-monorepo-template/domain';
import { NewDocument } from '@hexagonal-monorepo-template/ports';
import { InMemoryDocumentRepository } from './in-memory-document.repository';

const everything: DocumentListCriteria = {
  search: '', searchCategories: [], searchEmitters: [], categories: [], statuses: [], emitters: [],
  from: null, to: null, sort: DocumentSort.DATE,
};

function newDocument(name: string, sizeBytes: number, ownerId = 'u1'): NewDocument {
  return {
    companyId: 'c1', ownerId, uploadedById: ownerId, name: DocumentName.parse(name),
    category: DocumentCategory.OTHER, status: DocumentStatus.PENDING, format: DocumentFileFormat.PDF,
    sizeBytes, comment: null, storageKey: `k-${name}`, createdAt: new Date('2026-10-01T00:00:00Z'),
  };
}

describe('InMemoryDocumentRepository', () => {
  it('gives every inserted document its own identifier', async () => {
    const repository = new InMemoryDocumentRepository();

    const [first, second] = await repository.insertAll([newDocument('A', 1), newDocument('B', 2)]);

    expect(first.id).not.toBe(second.id);
    await expect(repository.findById(second.id)).resolves.toBe(second);
  });

  it('hands back nothing for an unknown identifier', async () => {
    await expect(new InMemoryDocumentRepository().findById('missing')).resolves.toBeNull();
  });

  it('lists the documents of one owner in the chosen order', async () => {
    const repository = new InMemoryDocumentRepository();
    await repository.insertAll([newDocument('Small', 1), newDocument('Large', 9), newDocument('Other', 5, 'u2')]);

    const list = await repository.list({ companyId: 'c1', ownerId: 'u1' }, { ...everything, sort: DocumentSort.SIZE });

    expect(list.items.map((item) => item.name)).toEqual(['Large', 'Small']);
    expect(list.total).toBe(2);
  });

  it('replaces a saved document', async () => {
    const repository = new InMemoryDocumentRepository();
    const [document] = await repository.insertAll([newDocument('A', 1)]);

    await repository.save(document.view());

    expect((await repository.findById(document.id))?.status).toBe(DocumentStatus.SEEN);
  });
});
