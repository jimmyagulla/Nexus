import {
  InMemoryDocumentRepository,
  RandomUuidGenerator,
} from '@hexagonal-monorepo-template/adapters';
import {
  Document,
  DocumentCategory,
  DocumentFileFormat,
  DocumentListCriteria,
  DocumentName,
  DocumentSort,
  DocumentStatus,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { ListDocumentsUseCase } from './list-documents.use-case';

const ids = new RandomUuidGenerator();

const everything: DocumentListCriteria = {
  search: '', searchCategories: [], searchEmitters: [], categories: [], statuses: [], emitters: [],
  from: null, to: null, sort: DocumentSort.DATE, direction: 'DESC' as const,
};

function doc(id: string, ownerId: string, companyId = 'c1', category: DocumentCategory = DocumentCategory.OTHER): Document {
  return new Document({
    id, companyId, ownerId, uploadedById: ownerId, name: DocumentName.parse(`Doc ${id}`), category,
    status: DocumentStatus.PENDING, format: DocumentFileFormat.PDF, sizeBytes: 1, comment: null,
    storageKey: `k-${id}`, createdAt: new Date('2026-10-01T00:00:00Z'),
  });
}

async function repositoryWith(...documents: Document[]): Promise<InMemoryDocumentRepository> {
  const repository = new InMemoryDocumentRepository(ids);
  for (const document of documents) {
    await repository.save(document);
  }
  return repository;
}

describe('ListDocumentsUseCase', () => {
  it('lists the documents of the actor only', async () => {
    const useCase = new ListDocumentsUseCase(
      await repositoryWith(doc('mine', 'u1'), doc('colleague', 'u2'), doc('elsewhere', 'u1', 'c2')),
    );

    const list = await useCase.execute({
      actor: { userId: 'u1', companyId: 'c1', role: UserRole.EMPLOYEE },
      criteria: everything,
    });

    expect(list.items.map((item) => item.id)).toEqual(['mine']);
    expect(list.total).toBe(1);
  });

  it('counts every document of the actor whatever the criteria', async () => {
    const useCase = new ListDocumentsUseCase(
      await repositoryWith(doc('a', 'u1', 'c1', DocumentCategory.PROOF), doc('b', 'u1', 'c1', DocumentCategory.OTHER)),
    );

    const list = await useCase.execute({
      actor: { userId: 'u1', companyId: 'c1', role: UserRole.EMPLOYEE },
      criteria: { ...everything, categories: [DocumentCategory.PROOF] },
    });

    expect(list.items.map((item) => item.id)).toEqual(['a']);
    expect(list.total).toBe(2);
    expect(list.categoryCounts).toEqual({ SICK_LEAVE: 0, OTHER: 1, ADMINISTRATIVE: 0, PROOF: 1 });
    expect(list.statusCounts).toEqual({ SEEN: 0, PENDING: 2, NEW: 0, PROCESSED: 0 });
  });

  it('refuses an actor bound to no company', async () => {
    const useCase = new ListDocumentsUseCase(await repositoryWith());

    await expect(
      useCase.execute({ actor: { userId: 'u1', companyId: null, role: null }, criteria: everything }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
