import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import {
  DownloadPayslipUseCase,
  ExportPayslipsUseCase,
  ListPayslipsUseCase,
  ViewPayslipUseCase,
} from '@hexagonal-monorepo-template/application';
import {
  InMemoryPayslipFileStorage,
  InMemoryPayslipRepository,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  DocumentFileFormat,
  Payslip,
  PayslipEmployerName,
  PayslipFileName,
  PayslipPeriod,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import {
  IDownloadPayslip,
  IExportPayslips,
  IListPayslips,
  IViewPayslip,
} from '@hexagonal-monorepo-template/ports';
import { ApiExceptionFilter } from '../common/filters/api-exception.filter';
import { AuthenticatedRequest } from '../common/guards/authenticated-request';
import { SuccessResponseInterceptor } from '../common/interceptors/success-response.interceptor';
import { createValidationPipe } from '../common/pipes/create-validation.pipe';
import { PayslipsController } from './payslips.controller';

const employee: ActorContext = { userId: 'user-1', companyId: 'company-1', role: UserRole.EMPLOYEE };
const PAYSLIPS_PATH = '/companies/company-1/payslips';
const pdf = { contentType: 'application/pdf', content: new TextEncoder().encode('%PDF-1.7\n') };

let app: INestApplication;
let baseUrl: string;
let actor: ActorContext | undefined;

type Envelope = { status: number; message: string; data: unknown };

async function send(path: string): Promise<{ status: number; payload: Envelope }> {
  const response = await fetch(`${baseUrl}${path}`);
  return { status: response.status, payload: (await response.json()) as Envelope };
}

function payslipOf(id: string, year: number, month: number, employeeId = 'user-1'): Payslip {
  return new Payslip({
    id, companyId: 'company-1', employeeId, uploadedById: 'hr-1', employerName: PayslipEmployerName.parse('Atelier Moreau'),
    period: PayslipPeriod.of(year, month), fileName: PayslipFileName.parse(`Bulletin_${year}-${month}`),
    format: DocumentFileFormat.PDF, sizeBytes: pdf.content.length, storageKey: `key-${id}`,
    availableAt: new Date(Date.UTC(year, month - 1, 28)), createdAt: new Date(Date.UTC(year, month - 1, 28)),
  });
}

beforeAll(async () => {
  const all = [payslipOf('feb', 2026, 2), payslipOf('jan', 2026, 1), payslipOf('dec', 2025, 12), payslipOf('other', 2026, 1, 'user-2')];
  const payslips = new InMemoryPayslipRepository(new Map(all.map((payslip) => [payslip.id, payslip])));
  const files = new InMemoryPayslipFileStorage(new Map(all.map((payslip) => [payslip.storageKey, pdf])));
  const moduleRef = await Test.createTestingModule({
    controllers: [PayslipsController],
    providers: [
      { provide: IListPayslips, useFactory: () => new ListPayslipsUseCase(payslips) },
      { provide: IViewPayslip, useFactory: () => new ViewPayslipUseCase(payslips, files) },
      { provide: IDownloadPayslip, useFactory: () => new DownloadPayslipUseCase(payslips, files) },
      { provide: IExportPayslips, useFactory: () => new ExportPayslipsUseCase(payslips, files) },
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

describe('PayslipsController', () => {
  it('lists the payslips of a year, January to December, with every year of the employee', async () => {
    const response = await send(`${PAYSLIPS_PATH}?year=2026`);

    expect(response.status).toBe(200);
    expect(response.payload.data).toMatchObject({
      items: [
        { id: 'jan', year: 2026, month: 1, employerName: 'Atelier Moreau', format: 'PDF' },
        { id: 'feb', year: 2026, month: 2 },
      ],
      total: 3,
      years: [2025, 2026],
    });
  });

  it('lists every payslip without a year', async () => {
    const response = await send(PAYSLIPS_PATH);

    expect((response.payload.data as { items: { id: string }[] }).items.map((item) => item.id)).toEqual(['dec', 'jan', 'feb']);
  });

  it.each(['1999', '2101', 'deux-mille', '2026.5'])('refuses the year %s', async (year) => {
    await expect(send(`${PAYSLIPS_PATH}?year=${year}`)).resolves.toMatchObject({ status: 400 });
  });

  it('opens and downloads a payslip of the employee through a link', async () => {
    const expected = { payslipId: 'jan', fileName: 'Bulletin_2026-1.pdf', contentType: 'application/pdf' };

    await expect(send(`${PAYSLIPS_PATH}/jan/view`)).resolves.toMatchObject({ status: 200, payload: { data: expected } });
    await expect(send(`${PAYSLIPS_PATH}/jan/download`)).resolves.toMatchObject({ status: 200, payload: { data: expected } });
  });

  it('hands back the download links of every payslip of a year', async () => {
    const response = await send(`${PAYSLIPS_PATH}/export?year=2026`);

    expect((response.payload.data as { payslipId: string }[]).map((link) => link.payslipId)).toEqual(['jan', 'feb']);
  });

  it('refuses the payslip of a colleague', async () => {
    await expect(send(`${PAYSLIPS_PATH}/other/view`)).resolves.toMatchObject({ status: 403 });
    await expect(send(`${PAYSLIPS_PATH}/other/download`)).resolves.toMatchObject({ status: 403 });
  });

  it('refuses the payslips of another company', async () => {
    await expect(send('/companies/company-2/payslips')).resolves.toMatchObject({ status: 403 });
  });
});
