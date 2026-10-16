import {
  FixedClock,
  InMemoryDocumentFileStorage,
  InMemoryDocumentRepository,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  DocumentCategory,
  DocumentEmitter,
  DocumentFileFormat,
  DocumentSort,
  DocumentStatus,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { DepositDocumentsUseCase } from './deposit-documents.use-case';

const employee: ActorContext = { userId: 'u1', companyId: 'c1', role: UserRole.EMPLOYEE };
const pdf = Uint8Array.from([...'%PDF-1.7\n'].map((c) => c.charCodeAt(0)));
const png = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);
const everything = {
  search: '', searchCategories: [], searchEmitters: [], categories: [], statuses: [], emitters: [],
  from: null, to: null, sort: DocumentSort.DATE,
};

function setUp() {
  const documents = new InMemoryDocumentRepository();
  const files = new InMemoryDocumentFileStorage();
  const useCase = new DepositDocumentsUseCase(
    documents,
    files,
    new FixedClock(new Date('2026-10-03T10:24:00Z')),
  );
  return { documents, files, useCase };
}

describe('DepositDocumentsUseCase', () => {
  it('records one pending document per file, emitted by the employee', async () => {
    const { useCase } = setUp();

    const deposited = await useCase.execute({
      actor: employee,
      request: {
        category: DocumentCategory.SICK_LEAVE,
        comment: 'Arrêt du 02/10 au 09/10',
        files: [
          { name: 'Arrêt', fileName: 'arret.pdf', content: pdf },
          { name: 'Photo', fileName: 'photo.png', content: png },
        ],
      },
    });

    expect(deposited).toMatchObject([
      {
        name: 'Arrêt', category: DocumentCategory.SICK_LEAVE, status: DocumentStatus.PENDING,
        format: DocumentFileFormat.PDF, sizeBytes: pdf.length, emitter: DocumentEmitter.SELF,
        comment: 'Arrêt du 02/10 au 09/10', createdAt: '2026-10-03T10:24:00.000Z',
      },
      {
        name: 'Photo', category: DocumentCategory.SICK_LEAVE, status: DocumentStatus.PENDING,
        format: DocumentFileFormat.PNG, sizeBytes: png.length, emitter: DocumentEmitter.SELF,
        comment: 'Arrêt du 02/10 au 09/10', createdAt: '2026-10-03T10:24:00.000Z',
      },
    ]);
  });

  it('stores each file in the folder of its owner, typed by its real format', async () => {
    const { useCase, files } = setUp();

    await useCase.execute({
      actor: employee,
      request: { category: DocumentCategory.OTHER, comment: null, files: [{ name: 'Scan', fileName: 'scan.png', content: png }] },
    });

    expect([...files.files.entries()].map(([key, file]) => ({
      inFolder: key.startsWith('c1/u1/'), contentType: file.contentType, content: file.content,
    }))).toEqual([{ inFolder: true, contentType: 'image/png', content: png }]);
  });

  it('lists the deposited documents for their owner', async () => {
    const { useCase, documents } = setUp();

    await useCase.execute({
      actor: employee,
      request: { category: DocumentCategory.OTHER, comment: null, files: [{ name: 'Scan', fileName: 'scan.pdf', content: pdf }] },
    });

    await expect(documents.list({ companyId: 'c1', ownerId: 'u1' }, everything)).resolves.toMatchObject({
      total: 1,
      items: [{ name: 'Scan' }],
    });
  });

  it('stores and records nothing when a file is refused', async () => {
    const { useCase, files, documents } = setUp();

    await expect(
      useCase.execute({
        actor: employee,
        request: {
          category: DocumentCategory.OTHER,
          comment: null,
          files: [
            { name: 'Scan', fileName: 'scan.pdf', content: pdf },
            { name: 'Faux', fileName: 'faux.pdf', content: png },
          ],
        },
      }),
    ).rejects.toThrow(ErrorCode.UNSUPPORTED_FILE_FORMAT);
    expect(files.files.size).toBe(0);
    await expect(documents.list({ companyId: 'c1', ownerId: 'u1' }, everything)).resolves.toMatchObject({ total: 0 });
  });

  it('refuses an actor bound to no company', async () => {
    const { useCase } = setUp();

    await expect(
      useCase.execute({
        actor: { ...employee, companyId: null },
        request: { category: DocumentCategory.OTHER, comment: null, files: [{ name: 'Scan', fileName: 'scan.pdf', content: pdf }] },
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
