import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import {
  ActorContext,
  CabinetExchangeSnapshot,
  ExchangeDirection,
  ExchangeStatus,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import {
  ICreateCabinetExchangeDraft,
  IDownloadCabinetExchangeFile,
  IListCabinetExchanges,
  IMarkCabinetExchangeToTransmit,
  IOpenCabinetExchange,
  ITransmitCabinetExchanges,
} from '@hexagonal-monorepo-template/ports';
import { ApiExceptionFilter } from '../common/filters/api-exception.filter';
import { AuthenticatedRequest } from '../common/guards/authenticated-request';
import { SuccessResponseInterceptor } from '../common/interceptors/success-response.interceptor';
import { createValidationPipe } from '../common/pipes/create-validation.pipe';
import { CabinetExchangeController } from './cabinet-exchange.controller';

const createDraft = {
  execute: vi.fn<ICreateCabinetExchangeDraft['execute']>(),
};
const markToTransmit = {
  execute: vi.fn<IMarkCabinetExchangeToTransmit['execute']>(),
};
const transmit = { execute: vi.fn<ITransmitCabinetExchanges['execute']>() };
const list = { execute: vi.fn<IListCabinetExchanges['execute']>() };
const open = { execute: vi.fn<IOpenCabinetExchange['execute']>() };
const download = {
  execute: vi.fn<IDownloadCabinetExchangeFile['execute']>(),
};

const employer: ActorContext = {
  userId: 'user-1',
  companyId: 'company-1',
  role: UserRole.EMPLOYER,
};

const accountant: ActorContext = {
  userId: 'cab-1',
  companyId: 'company-1',
  role: UserRole.ACCOUNTANT,
};

const snapshot: CabinetExchangeSnapshot = {
  id: 'ex-1',
  direction: ExchangeDirection.COMPANY_TO_CABINET,
  status: ExchangeStatus.DRAFT,
  category: 'Facture',
  document: { fileName: 'a.pdf', mimeType: 'application/pdf', size: 2 },
  senderId: 'user-1',
  date: '2026-10-06T09:00:00.000Z',
  consultedAt: null,
};

const BASE = '/companies/company-1/cabinet-exchanges';

let app: INestApplication;
let baseUrl: string;
let actor: ActorContext | undefined;

async function send(
  method: string,
  path: string,
  body?: unknown,
): Promise<{ status: number; payload: unknown }> {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    ...(body === undefined
      ? {}
      : {
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(body),
        }),
  });

  return { status: response.status, payload: await response.json() };
}

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    controllers: [CabinetExchangeController],
    providers: [
      { provide: ICreateCabinetExchangeDraft, useValue: createDraft },
      { provide: IMarkCabinetExchangeToTransmit, useValue: markToTransmit },
      { provide: ITransmitCabinetExchanges, useValue: transmit },
      { provide: IListCabinetExchanges, useValue: list },
      { provide: IOpenCabinetExchange, useValue: open },
      { provide: IDownloadCabinetExchangeFile, useValue: download },
    ],
  }).compile();

  app = moduleRef.createNestApplication({ logger: false });
  app.use(
    (request: AuthenticatedRequest, _response: unknown, next: () => void) => {
      request.actor = actor;
      next();
    },
  );
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
  actor = employer;
  for (const port of [
    createDraft,
    markToTransmit,
    transmit,
    list,
    open,
    download,
  ]) {
    port.execute.mockReset();
  }
  createDraft.execute.mockResolvedValue(snapshot);
  markToTransmit.execute.mockResolvedValue(snapshot);
  transmit.execute.mockResolvedValue([snapshot]);
  list.execute.mockResolvedValue([snapshot]);
  open.execute.mockResolvedValue(snapshot);
  download.execute.mockResolvedValue({
    fileName: 'a.pdf',
    mimeType: 'application/pdf',
    content: new Uint8Array([72, 105]),
  });
});

describe('CabinetExchangeController', () => {
  describe('POST /companies/:companyId/cabinet-exchanges', () => {
    it('answers 201 with the created draft', async () => {
      await expect(
        send('POST', BASE, {
          category: 'Facture',
          file: {
            fileName: 'a.pdf',
            mimeType: 'application/pdf',
            contentBase64: 'SGk=',
          },
        }),
      ).resolves.toEqual({
        status: 201,
        payload: { status: 201, message: 'Success', data: snapshot },
      });
    });

    it('hands the decoded file and the category to the use case', async () => {
      await send('POST', BASE, {
        category: 'Facture',
        file: {
          fileName: 'a.pdf',
          mimeType: 'application/pdf',
          contentBase64: 'SGk=',
        },
      });

      expect(createDraft.execute).toHaveBeenCalledWith({
        actor: employer,
        companyId: 'company-1',
        category: 'Facture',
        file: {
          fileName: 'a.pdf',
          mimeType: 'application/pdf',
          content: new Uint8Array([72, 105]),
        },
      });
    });

    it('accepts a draft without category nor file', async () => {
      const { status } = await send('POST', BASE, {});

      expect(status).toBe(201);
      expect(createDraft.execute).toHaveBeenCalledWith({
        actor: employer,
        companyId: 'company-1',
        category: null,
        file: null,
      });
    });

    it('answers 400 when the file lacks its content', async () => {
      const { status } = await send('POST', BASE, {
        file: { fileName: 'a.pdf', mimeType: 'application/pdf' },
      });

      expect(status).toBe(400);
      expect(createDraft.execute).not.toHaveBeenCalled();
    });

    it('answers 403 when the actor is not an employer', async () => {
      actor = { ...employer, role: UserRole.EMPLOYEE };

      const { status } = await send('POST', BASE, {});

      expect(status).toBe(403);
      expect(createDraft.execute).not.toHaveBeenCalled();
    });

    it('answers 403 when the cabinet tries to create a draft', async () => {
      actor = { ...employer, role: UserRole.ACCOUNTANT };

      const { status } = await send('POST', BASE, {});

      expect(status).toBe(403);
    });

    it('answers 403 when the company of the path is not the actor company', async () => {
      const { status } = await send(
        'POST',
        '/companies/company-2/cabinet-exchanges',
        {},
      );

      expect(status).toBe(403);
      expect(createDraft.execute).not.toHaveBeenCalled();
    });

    it('relays the refusal of an invalid file as a 400', async () => {
      createDraft.execute.mockRejectedValue(new Error('INVALID_FILE'));

      await expect(send('POST', BASE, {})).resolves.toEqual({
        status: 400,
        payload: { status: 400, message: 'INVALID_FILE' },
      });
    });
  });

  describe('POST /companies/:companyId/cabinet-exchanges/:exchangeId/to-transmit', () => {
    it('answers 201 with the exchange marked To transmit', async () => {
      const marked = { ...snapshot, status: ExchangeStatus.TO_TRANSMIT };
      markToTransmit.execute.mockResolvedValue(marked);

      await expect(
        send('POST', `${BASE}/ex-1/to-transmit`, { category: 'Facture' }),
      ).resolves.toEqual({
        status: 201,
        payload: { status: 201, message: 'Success', data: marked },
      });
    });

    it('hands the exchange of the path to the use case', async () => {
      await send('POST', `${BASE}/ex-1/to-transmit`, {});

      expect(markToTransmit.execute).toHaveBeenCalledWith({
        actor: employer,
        companyId: 'company-1',
        exchangeId: 'ex-1',
        category: null,
        file: null,
      });
    });

    it('relays the refusal of a missing document as a 400', async () => {
      markToTransmit.execute.mockRejectedValue(new Error('MISSING_DOCUMENT'));

      await expect(
        send('POST', `${BASE}/ex-1/to-transmit`, {}),
      ).resolves.toEqual({
        status: 400,
        payload: { status: 400, message: 'MISSING_DOCUMENT' },
      });
    });
  });

  describe('POST /companies/:companyId/cabinet-exchanges/transmission', () => {
    it('answers 201 with the transmitted exchanges', async () => {
      await expect(
        send('POST', `${BASE}/transmission`, { exchangeIds: ['ex-1'] }),
      ).resolves.toEqual({
        status: 201,
        payload: { status: 201, message: 'Success', data: [snapshot] },
      });
    });

    it('hands every exchange to the use case', async () => {
      await send('POST', `${BASE}/transmission`, {
        exchangeIds: ['ex-1', 'ex-2'],
      });

      expect(transmit.execute).toHaveBeenCalledWith({
        actor: employer,
        companyId: 'company-1',
        exchangeIds: ['ex-1', 'ex-2'],
      });
    });

    it('answers 400 without any exchange', async () => {
      const { status } = await send('POST', `${BASE}/transmission`, {});

      expect(status).toBe(400);
      expect(transmit.execute).not.toHaveBeenCalled();
    });

    it('relays a failed transmission as a 400 the employer can retry', async () => {
      transmit.execute.mockRejectedValue(new Error('TRANSMISSION_FAILED'));

      await expect(
        send('POST', `${BASE}/transmission`, { exchangeIds: ['ex-1'] }),
      ).resolves.toEqual({
        status: 400,
        payload: { status: 400, message: 'TRANSMISSION_FAILED' },
      });
    });
  });

  describe('GET /companies/:companyId/cabinet-exchanges', () => {
    it('answers 200 with the exchanges of the company', async () => {
      await expect(send('GET', BASE)).resolves.toEqual({
        status: 200,
        payload: { status: 200, message: 'Success', data: [snapshot] },
      });
    });

    it('asks the use case on behalf of the actor', async () => {
      await send('GET', BASE);

      expect(list.execute).toHaveBeenCalledWith({
        actor: employer,
        companyId: 'company-1',
      });
    });
  });

  describe('as the cabinet', () => {
    beforeEach(() => {
      actor = accountant;
    });

    it('lists the exchanges it received', async () => {
      await expect(send('GET', BASE)).resolves.toEqual({
        status: 200,
        payload: { status: 200, message: 'Success', data: [snapshot] },
      });
      expect(list.execute).toHaveBeenCalledWith({
        actor: accountant,
        companyId: 'company-1',
      });
    });

    it('opens an exchange, which consults it', async () => {
      await expect(
        send('POST', `${BASE}/ex-1/consultation`),
      ).resolves.toEqual({
        status: 201,
        payload: { status: 201, message: 'Success', data: snapshot },
      });
      expect(open.execute).toHaveBeenCalledWith({
        actor: accountant,
        companyId: 'company-1',
        exchangeId: 'ex-1',
      });
    });

    it('downloads the file of an exchange as base64 text', async () => {
      await expect(send('GET', `${BASE}/ex-1/file`)).resolves.toEqual({
        status: 200,
        payload: {
          status: 200,
          message: 'Success',
          data: {
            fileName: 'a.pdf',
            mimeType: 'application/pdf',
            contentBase64: 'SGk=',
          },
        },
      });
      expect(download.execute).toHaveBeenCalledWith({
        actor: accountant,
        companyId: 'company-1',
        exchangeId: 'ex-1',
      });
    });

    it('answers 403 DOCUMENT_INACCESSIBLE for an exchange not meant for it', async () => {
      open.execute.mockRejectedValue(new Error('INACCESSIBLE_DOCUMENT'));

      await expect(
        send('POST', `${BASE}/ex-1/consultation`),
      ).resolves.toEqual({
        status: 403,
        payload: { status: 403, message: 'INACCESSIBLE_DOCUMENT' },
      });
    });

    it('cannot prepare, mark or transmit an exchange', async () => {
      for (const [method, path] of [
        ['POST', BASE],
        ['POST', `${BASE}/ex-1/to-transmit`],
        ['POST', `${BASE}/transmission`],
      ] as const) {
        expect((await send(method, path, {})).status).toBe(403);
      }
    });
  });

  describe('as an employee', () => {
    beforeEach(() => {
      actor = { ...employer, role: UserRole.EMPLOYEE };
    });

    it('cannot list, open nor download any exchange', async () => {
      for (const [method, path] of [
        ['GET', BASE],
        ['POST', `${BASE}/ex-1/consultation`],
        ['GET', `${BASE}/ex-1/file`],
      ] as const) {
        expect((await send(method, path)).status).toBe(403);
      }
    });
  });
});
