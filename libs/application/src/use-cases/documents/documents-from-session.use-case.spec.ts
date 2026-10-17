import {
  FixedClock,
  InMemoryDocumentGateway,
  InMemorySessionGateway,
  RandomUuidGenerator,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  DocumentCategory,
  DocumentListCriteria,
  DocumentSort,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { DepositDocumentsFromSessionUseCase } from './deposit-documents-from-session.use-case';
import { DownloadDocumentFromSessionUseCase } from './download-document-from-session.use-case';
import { ListDocumentsFromSessionUseCase } from './list-documents-from-session.use-case';
import { ViewDocumentFromSessionUseCase } from './view-document-from-session.use-case';

const actor: ActorContext = { userId: 'u1', companyId: 'c1', role: UserRole.EMPLOYEE };
const everything: DocumentListCriteria = {
  search: '', searchCategories: [], searchEmitters: [], categories: [], statuses: [], emitters: [],
  from: null, to: null, sort: DocumentSort.DATE, direction: 'DESC' as const,
};
const pdf = Uint8Array.from([...'%PDF-1.7\n'].map((c) => c.charCodeAt(0)));
const scan = {
  category: DocumentCategory.OTHER,
  comment: null,
  files: [{ name: 'Scan', fileName: 'scan.pdf', content: pdf }],
};

function gateway(): InMemoryDocumentGateway {
  return new InMemoryDocumentGateway(
    new RandomUuidGenerator(),
    new FixedClock(new Date('2026-10-03T10:24:00.000Z')),
  );
}

describe('documents from the session', () => {
  it('deposits, then lists, the documents of the company carried by the session', async () => {
    const sessions = new InMemorySessionGateway('token', actor);
    const documents = gateway();

    const [deposited] = await new DepositDocumentsFromSessionUseCase(sessions, documents).execute(scan);

    await expect(new ListDocumentsFromSessionUseCase(sessions, documents).execute(everything)).resolves.toMatchObject({
      items: [{ id: deposited.id, name: 'Scan' }],
      total: 1,
    });
  });

  it('opens and downloads a document of the session', async () => {
    const sessions = new InMemorySessionGateway('token', actor);
    const documents = gateway();
    const [deposited] = await new DepositDocumentsFromSessionUseCase(sessions, documents).execute(scan);

    await expect(new ViewDocumentFromSessionUseCase(sessions, documents).execute(deposited.id)).resolves.toMatchObject({
      fileName: 'Scan.pdf',
    });
    await expect(new DownloadDocumentFromSessionUseCase(sessions, documents).execute(deposited.id)).resolves.toMatchObject({
      fileName: 'Scan.pdf',
    });
  });

  it('never sends a file whose content does not match its extension', async () => {
    const sessions = new InMemorySessionGateway('token', actor);
    const documents = gateway();

    await expect(
      new DepositDocumentsFromSessionUseCase(sessions, documents).execute({
        ...scan,
        files: [{ name: 'Scan', fileName: 'scan.png', content: pdf }],
      }),
    ).rejects.toThrow(ErrorCode.UNSUPPORTED_FILE_FORMAT);
    await expect(new ListDocumentsFromSessionUseCase(sessions, documents).execute(everything)).resolves.toMatchObject({
      total: 0,
    });
  });

  it('refuses when the session carries no company', async () => {
    const useCase = new ListDocumentsFromSessionUseCase(
      new InMemorySessionGateway('token', { ...actor, companyId: null }),
      gateway(),
    );

    await expect(useCase.execute(everything)).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
