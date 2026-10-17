import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import {
  DepositDocumentsUseCase,
  DownloadDocumentUseCase,
  ListDocumentsUseCase,
  ViewDocumentUseCase,
} from '@hexagonal-monorepo-template/application';
import {
  FixedClock,
  InMemoryDocumentFileStorage,
  InMemoryDocumentRepository,
  RandomUuidGenerator,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  DOCUMENT_MAX_FILE_SIZE_BYTES,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import {
  IDepositDocuments,
  IDownloadDocument,
  IListDocuments,
  IViewDocument,
} from '@hexagonal-monorepo-template/ports';
import { ApiExceptionFilter } from '../common/filters/api-exception.filter';
import { AuthenticatedRequest } from '../common/guards/authenticated-request';
import { SuccessResponseInterceptor } from '../common/interceptors/success-response.interceptor';
import { createValidationPipe } from '../common/pipes/create-validation.pipe';
import { DocumentsController } from './documents.controller';

const ids = new RandomUuidGenerator();

const employee: ActorContext = { userId: 'user-1', companyId: 'company-1', role: UserRole.EMPLOYEE };
const DOCUMENTS_PATH = '/companies/company-1/documents';
const pdf = new TextEncoder().encode('%PDF-1.7\n%âãÏÓ\n');
const png = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);

let app: INestApplication;
let baseUrl: string;
let actor: ActorContext | undefined;
let documents: InMemoryDocumentRepository;
let files: InMemoryDocumentFileStorage;

type Envelope = { status: number; message: string; data: unknown };

async function send(method: string, path: string, body?: FormData): Promise<{ status: number; payload: Envelope }> {
  const response = await fetch(`${baseUrl}${path}`, { method, body });
  return { status: response.status, payload: (await response.json()) as Envelope };
}

function depositForm(
  parts: { name: string; fileName: string; content: Uint8Array; type?: string }[],
  fields: Record<string, string> = { category: 'SICK_LEAVE' },
): FormData {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    form.append(key, value);
  }
  for (const part of parts) {
    form.append('names', part.name);
    form.append('files', new Blob([part.content as Uint8Array<ArrayBuffer>], { type: part.type ?? 'application/pdf' }), part.fileName);
  }
  return form;
}

beforeAll(async () => {
  documents = new InMemoryDocumentRepository(ids);
  files = new InMemoryDocumentFileStorage(ids);
  const moduleRef = await Test.createTestingModule({
    controllers: [DocumentsController],
    providers: [
      { provide: IListDocuments, useFactory: () => new ListDocumentsUseCase(documents) },
      {
        provide: IDepositDocuments,
        useFactory: () => new DepositDocumentsUseCase(documents, files, new FixedClock(new Date('2026-10-03T10:24:00Z'))),
      },
      { provide: IViewDocument, useFactory: () => new ViewDocumentUseCase(documents, files) },
      { provide: IDownloadDocument, useFactory: () => new DownloadDocumentUseCase(documents, files) },
    ],
  }).compile();

  app = moduleRef.createNestApplication({ logger: false });
  app.use((request: AuthenticatedRequest, _response: unknown, next: () => void) => {
    request.actor = actor;
    next();
  });
  app.useGlobalPipes(createValidationPipe());
  app.useGlobalInterceptors(new SuccessResponseInterceptor());
  app.useGlobalFilters(new ApiExceptionFilter());
  await app.listen(0);
  baseUrl = await app.getUrl();
});

afterAll(async () => {
  await app.close();
});

beforeEach(() => {
  actor = employee;
});

describe('DocumentsController', () => {
  it('deposits one pending document per file and lists it right away', async () => {
    const deposit = await send(
      'POST',
      DOCUMENTS_PATH,
      depositForm(
        [
          { name: 'Arrêt du 2 octobre', fileName: 'arrêt.pdf', content: pdf },
          { name: 'Photo', fileName: 'photo.png', content: png, type: 'image/png' },
        ],
        { category: 'SICK_LEAVE', comment: 'Prescrit du 02/10 au 09/10' },
      ),
    );
    const list = await send('GET', `${DOCUMENTS_PATH}?search=arr%C3%AAt`);

    expect(deposit.status).toBe(201);
    expect(deposit.payload.data).toMatchObject([
      { name: 'Arrêt du 2 octobre', status: 'PENDING', format: 'PDF', emitter: 'SELF', comment: 'Prescrit du 02/10 au 09/10' },
      { name: 'Photo', status: 'PENDING', format: 'PNG' },
    ]);
    expect(list.status).toBe(200);
    expect(list.payload.data).toMatchObject({ items: [{ name: 'Arrêt du 2 octobre' }] });
  });

  it('refuses a file whose content does not match its extension', async () => {
    const response = await send('POST', DOCUMENTS_PATH, depositForm([{ name: 'Faux', fileName: 'faux.pdf', content: png }]));

    expect(response).toMatchObject({ status: 400, payload: { message: 'UNSUPPORTED_FILE_FORMAT' } });
  });

  it('refuses a file above the largest size before reading it whole', async () => {
    const tooLarge = new Uint8Array(DOCUMENT_MAX_FILE_SIZE_BYTES + 1);
    tooLarge.set(pdf);

    const response = await send('POST', DOCUMENTS_PATH, depositForm([{ name: 'Énorme', fileName: 'enorme.pdf', content: tooLarge }]));

    expect(response).toMatchObject({ status: 413, payload: { message: 'FILE_TOO_LARGE' } });
  });

  it('refuses a name above 50 characters', async () => {
    const response = await send('POST', DOCUMENTS_PATH, depositForm([{ name: 'n'.repeat(51), fileName: 'scan.pdf', content: pdf }]));

    expect(response.status).toBe(400);
  });

  it('refuses a comment above 250 characters', async () => {
    const response = await send(
      'POST',
      DOCUMENTS_PATH,
      depositForm([{ name: 'Scan', fileName: 'scan.pdf', content: pdf }], { category: 'OTHER', comment: 'c'.repeat(251) }),
    );

    expect(response.status).toBe(400);
  });

  it('refuses an unknown type', async () => {
    const response = await send(
      'POST',
      DOCUMENTS_PATH,
      depositForm([{ name: 'Scan', fileName: 'scan.pdf', content: pdf }], { category: 'PAYSLIP' }),
    );

    expect(response.status).toBe(400);
  });

  it('refuses a deposit without file', async () => {
    const form = new FormData();
    form.append('category', 'OTHER');
    form.append('names', 'Scan');

    const response = await send('POST', DOCUMENTS_PATH, form);

    expect(response).toMatchObject({ status: 400, payload: { message: 'REQUIRED_INFORMATION' } });
  });

  it('refuses an unknown filter value', async () => {
    const response = await send('GET', `${DOCUMENTS_PATH}?statuses=LOST`);

    expect(response.status).toBe(400);
  });

  it('opens a document of its owner and marks it as seen', async () => {
    const deposit = await send('POST', DOCUMENTS_PATH, depositForm([{ name: 'À voir', fileName: 'voir.pdf', content: pdf }]));
    const [{ id }] = deposit.payload.data as { id: string }[];

    const view = await send('POST', `${DOCUMENTS_PATH}/${id}/view`);

    expect(view).toMatchObject({ status: 201, payload: { data: { url: expect.stringMatching(/^data:application\/pdf;base64,/), fileName: 'À voir.pdf', contentType: 'application/pdf' } } });
    expect((await documents.findById(id))?.status).toBe('SEEN');
  });

  it('downloads a document under its name', async () => {
    const deposit = await send('POST', DOCUMENTS_PATH, depositForm([{ name: 'Facture', fileName: 'facture.pdf', content: pdf }]));
    const [{ id }] = deposit.payload.data as { id: string }[];

    const download = await send('GET', `${DOCUMENTS_PATH}/${id}/download`);

    expect(download).toMatchObject({ status: 200, payload: { data: { fileName: 'Facture.pdf', contentType: 'application/pdf' } } });
  });

  it('refuses the document of a colleague', async () => {
    const deposit = await send('POST', DOCUMENTS_PATH, depositForm([{ name: 'Privé', fileName: 'prive.pdf', content: pdf }]));
    const [{ id }] = deposit.payload.data as { id: string }[];
    actor = { ...employee, userId: 'user-2' };

    await expect(send('POST', `${DOCUMENTS_PATH}/${id}/view`)).resolves.toMatchObject({ status: 403 });
    await expect(send('GET', `${DOCUMENTS_PATH}/${id}/download`)).resolves.toMatchObject({ status: 403 });
  });

  it('refuses the documents of another company', async () => {
    const response = await send('GET', '/companies/company-2/documents');

    expect(response.status).toBe(403);
  });
});
