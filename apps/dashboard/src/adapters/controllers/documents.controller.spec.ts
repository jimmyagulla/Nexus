import {
  ApiDocumentGateway,
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import {
  DepositDocumentsFromSessionUseCase,
  DownloadDocumentFromSessionUseCase,
  ListDocumentsFromSessionUseCase,
  ViewDocumentFromSessionUseCase,
} from '@hexagonal-monorepo-template/application';
import {
  DocumentCategory,
  DocumentEmitter,
  DocumentSort,
  DocumentStatus,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { DocumentsController, DocumentsListState } from './documents.controller';

const nothing: DocumentsListState = {
  search: '', categories: [], statuses: [], emitter: null, from: '', to: '', sort: DocumentSort.DATE, direction: 'DESC' as const,
};

function controllerWith(http = new InMemoryHttpClient()): DocumentsController {
  const sessions = new InMemorySessionGateway('token', { userId: 'u1', companyId: 'c1', role: UserRole.EMPLOYEE });
  const gateway = new ApiDocumentGateway(http);
  return new DocumentsController(
    new ListDocumentsFromSessionUseCase(sessions, gateway),
    new DepositDocumentsFromSessionUseCase(sessions, gateway),
    new ViewDocumentFromSessionUseCase(sessions, gateway),
    new DownloadDocumentFromSessionUseCase(sessions, gateway),
    {
      categories: { SICK_LEAVE: 'Arrêt maladie', PROOF: 'Justificatif', ADMINISTRATIVE: 'Document administratif', OTHER: 'Autre' },
      emitters: { HR: 'Service RH', SELF: 'Vous' },
    },
  );
}

describe('DocumentsController', () => {
  it('asks for every document when nothing is chosen', () => {
    expect(controllerWith().criteriaFor(nothing)).toEqual({
      search: '', searchCategories: [], searchEmitters: [], categories: [], statuses: [], emitters: [],
      from: null, to: null, sort: DocumentSort.DATE, direction: 'DESC' as const,
    });
  });

  it('also searches the categories and emitters whose label matches, whatever the accents', () => {
    expect(controllerWith().criteriaFor({ ...nothing, search: ' MALADIE ' })).toMatchObject({
      search: 'MALADIE', searchCategories: [DocumentCategory.SICK_LEAVE], searchEmitters: [],
    });
    expect(controllerWith().criteriaFor({ ...nothing, search: 'arret' }).searchCategories).toEqual([DocumentCategory.SICK_LEAVE]);
    expect(controllerWith().criteriaFor({ ...nothing, search: 'rh' }).searchEmitters).toEqual([DocumentEmitter.HR]);
  });

  it('gives the same criteria whatever the order filters were ticked in', () => {
    const controller = controllerWith();

    expect(
      controller.criteriaFor({ ...nothing, categories: [DocumentCategory.PROOF, DocumentCategory.OTHER], statuses: [DocumentStatus.SEEN, DocumentStatus.NEW] }),
    ).toEqual(
      controller.criteriaFor({ ...nothing, categories: [DocumentCategory.OTHER, DocumentCategory.PROOF], statuses: [DocumentStatus.NEW, DocumentStatus.SEEN] }),
    );
  });

  it('applies a period only once its days are real', () => {
    const controller = controllerWith();

    expect(controller.criteriaFor({ ...nothing, from: '2026-10-01', to: '2026-10-31' })).toMatchObject({ from: '2026-10-01', to: '2026-10-31' });
    expect(controller.criteriaFor({ ...nothing, from: '', to: '2026-02-31' })).toMatchObject({ from: null, to: null });
  });

  it('keeps the most recent first while no column is sorted, and follows a sorted column otherwise', () => {
    const controller = controllerWith();

    expect(controller.criteriaFor({ ...nothing, sort: null, direction: 'ASC' })).toMatchObject({ sort: DocumentSort.DATE, direction: 'DESC' });
    expect(controller.criteriaFor({ ...nothing, sort: DocumentSort.NAME, direction: 'ASC' })).toMatchObject({ sort: DocumentSort.NAME, direction: 'ASC' });
  });

  it('keeps one emitter when one is chosen', () => {
    expect(controllerWith().criteriaFor({ ...nothing, emitter: DocumentEmitter.SELF }).emitters).toEqual([DocumentEmitter.SELF]);
  });

  it('sends the bytes of each picked file with its name', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'companies/c1/documents', { status: 201, data: [] });
    const pdf = new File(['%PDF-1.7\n'], 'arret.pdf', { type: 'application/pdf' });

    await controllerWith(http).depositDocuments({
      category: DocumentCategory.SICK_LEAVE,
      comment: '',
      files: [{ file: pdf, name: 'Arrêt' }],
    });

    expect(http.calls[0].data).toMatchObject({
      fields: [{ name: 'category', value: 'SICK_LEAVE' }, { name: 'names', value: 'Arrêt' }],
      files: [{ fileName: 'arret.pdf', contentType: 'application/pdf' }],
    });
  });

  it('hands back the link of a viewed or downloaded document', async () => {
    const http = new InMemoryHttpClient();
    const link = { url: 'https://v', fileName: 'Arrêt.pdf', contentType: 'application/pdf' };
    http.reply('post', 'companies/c1/documents/d1/view', { status: 201, data: link });
    http.reply('get', 'companies/c1/documents/d1/download', { status: 200, data: { ...link, url: 'https://d' } });
    const controller = controllerWith(http);

    await expect(controller.viewDocument('d1')).resolves.toEqual(link);
    await expect(controller.downloadDocument('d1')).resolves.toMatchObject({ url: 'https://d', fileName: 'Arrêt.pdf' });
  });
});
