import {
  ApiDocumentGateway,
  InMemoryHttpClient,
  InMemorySessionGateway,
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
  from: null, to: null, sort: DocumentSort.DATE,
};
const emptyList = {
  items: [], total: 0,
  categoryCounts: { SICK_LEAVE: 0, OTHER: 0, ADMINISTRATIVE: 0, PROOF: 0 },
  statusCounts: { SEEN: 0, PENDING: 0, NEW: 0, PROCESSED: 0 },
};
const pdf = Uint8Array.from([...'%PDF-1.7\n'].map((c) => c.charCodeAt(0)));

function http(): InMemoryHttpClient {
  const client = new InMemoryHttpClient();
  client.reply('get', 'companies/c1/documents?sort=DATE', { status: 200, data: emptyList });
  client.reply('post', 'companies/c1/documents', { status: 201, data: [] });
  client.reply('post', 'companies/c1/documents/d1/view', { status: 201, data: { url: 'https://files/view' } });
  client.reply('get', 'companies/c1/documents/d1/download', { status: 200, data: { url: 'https://files/download' } });
  return client;
}

describe('documents from the session', () => {
  it('lists the documents of the company carried by the session', async () => {
    const useCase = new ListDocumentsFromSessionUseCase(
      new InMemorySessionGateway('token', actor),
      new ApiDocumentGateway(http()),
    );

    await expect(useCase.execute(everything)).resolves.toEqual(emptyList);
  });

  it('opens and downloads a document through the API', async () => {
    const sessions = new InMemorySessionGateway('token', actor);
    const gateway = new ApiDocumentGateway(http());

    await expect(new ViewDocumentFromSessionUseCase(sessions, gateway).execute('d1')).resolves.toEqual({ url: 'https://files/view' });
    await expect(new DownloadDocumentFromSessionUseCase(sessions, gateway).execute('d1')).resolves.toEqual({ url: 'https://files/download' });
  });

  it('sends a valid deposit', async () => {
    const client = http();
    const useCase = new DepositDocumentsFromSessionUseCase(
      new InMemorySessionGateway('token', actor),
      new ApiDocumentGateway(client),
    );

    await useCase.execute({
      category: DocumentCategory.OTHER,
      comment: null,
      files: [{ name: 'Scan', fileName: 'scan.pdf', content: pdf }],
    });

    expect(client.calls.map((call) => `${call.method} ${call.url}`)).toEqual(['post companies/c1/documents']);
  });

  it('never sends a file whose content does not match its extension', async () => {
    const client = http();
    const useCase = new DepositDocumentsFromSessionUseCase(
      new InMemorySessionGateway('token', actor),
      new ApiDocumentGateway(client),
    );

    await expect(
      useCase.execute({
        category: DocumentCategory.OTHER,
        comment: null,
        files: [{ name: 'Scan', fileName: 'scan.png', content: pdf }],
      }),
    ).rejects.toThrow(ErrorCode.UNSUPPORTED_FILE_FORMAT);
    expect(client.calls).toEqual([]);
  });

  it('refuses when the session carries no company', async () => {
    const useCase = new ListDocumentsFromSessionUseCase(
      new InMemorySessionGateway('token', { ...actor, companyId: null }),
      new ApiDocumentGateway(http()),
    );

    await expect(useCase.execute(everything)).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
