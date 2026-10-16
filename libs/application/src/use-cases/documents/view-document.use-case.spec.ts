import {
  InMemoryDocumentFileStorage,
  InMemoryDocumentRepository,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  Document,
  DocumentCategory,
  DocumentFileFormat,
  DocumentName,
  DocumentStatus,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { DownloadDocumentUseCase } from './download-document.use-case';
import { ViewDocumentUseCase } from './view-document.use-case';

const owner: ActorContext = { userId: 'u1', companyId: 'c1', role: UserRole.EMPLOYEE };

function pending(storageKey: string): Document {
  return new Document({
    id: 'd1', companyId: 'c1', ownerId: 'u1', uploadedById: 'u1', name: DocumentName.parse('Arrêt'),
    category: DocumentCategory.SICK_LEAVE, status: DocumentStatus.PENDING, format: DocumentFileFormat.PDF,
    sizeBytes: 1, comment: null, storageKey, createdAt: new Date('2026-10-01T00:00:00Z'),
  });
}

async function setUp() {
  const files = new InMemoryDocumentFileStorage();
  const key = await files.store({ folder: 'c1/u1', contentType: 'application/pdf', content: Uint8Array.from([0x25, 0x50, 0x44, 0x46]) });
  const documents = new InMemoryDocumentRepository();
  await documents.save(pending(key));
  return {
    documents,
    view: new ViewDocumentUseCase(documents, files),
    download: new DownloadDocumentUseCase(documents, files),
  };
}

describe('ViewDocumentUseCase', () => {
  it('hands back a link opening the file, with its name and type', async () => {
    const { view } = await setUp();

    await expect(view.execute({ actor: owner, documentId: 'd1' })).resolves.toEqual({
      url: 'data:application/pdf;base64,JVBERg==',
      fileName: 'Arrêt.pdf',
      contentType: 'application/pdf',
    });
  });

  it('marks the document as seen', async () => {
    const { view, documents } = await setUp();

    await view.execute({ actor: owner, documentId: 'd1' });

    expect((await documents.findById('d1'))?.status).toBe(DocumentStatus.SEEN);
  });

  it.each([
    ['a colleague', { ...owner, userId: 'u2' }],
    ['someone from another company', { ...owner, companyId: 'c2' }],
  ])('refuses %s and leaves the status untouched', async (_who, actor) => {
    const { view, documents } = await setUp();

    await expect(view.execute({ actor, documentId: 'd1' })).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    expect((await documents.findById('d1'))?.status).toBe(DocumentStatus.PENDING);
  });

  it('refuses an unknown document', async () => {
    const { view } = await setUp();

    await expect(view.execute({ actor: owner, documentId: 'missing' })).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});

describe('DownloadDocumentUseCase', () => {
  it('hands back a link to the file and the name to save it under', async () => {
    const { download } = await setUp();

    await expect(download.execute({ actor: owner, documentId: 'd1' })).resolves.toEqual({
      url: 'data:application/pdf;base64,JVBERg==',
      fileName: 'Arrêt.pdf',
      contentType: 'application/pdf',
    });
  });

  it('leaves the status untouched', async () => {
    const { download, documents } = await setUp();

    await download.execute({ actor: owner, documentId: 'd1' });

    expect((await documents.findById('d1'))?.status).toBe(DocumentStatus.PENDING);
  });

  it('refuses a colleague', async () => {
    const { download } = await setUp();

    await expect(
      download.execute({ actor: { ...owner, userId: 'u2' }, documentId: 'd1' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
