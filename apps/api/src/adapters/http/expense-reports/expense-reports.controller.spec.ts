import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import {
  ChangeExpenseReportStatusUseCase,
  ListEmployeeExpenseReportsUseCase,
  ListExpenseReportsUseCase,
  ReviseExpenseReportUseCase,
  SubmitExpenseReportUseCase,
  ViewExpenseReportProofUseCase,
} from '@hexagonal-monorepo-template/application';
import {
  FixedClock,
  InMemoryExpenseReportProofStorage,
  InMemoryExpenseReportRepository,
  RandomUuidGenerator,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  EXPENSE_REPORT_PROOF_MAX_SIZE_BYTES,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import {
  IChangeExpenseReportStatus,
  IListEmployeeExpenseReports,
  IListExpenseReports,
  IReviseExpenseReport,
  ISubmitExpenseReport,
  IViewExpenseReportProof,
} from '@hexagonal-monorepo-template/ports';
import { ApiExceptionFilter } from '../common/filters/api-exception.filter';
import { AuthenticatedRequest } from '../common/guards/authenticated-request';
import { SuccessResponseInterceptor } from '../common/interceptors/success-response.interceptor';
import { createValidationPipe } from '../common/pipes/create-validation.pipe';
import { EmployerExpenseReportsController } from './employer-expense-reports.controller';
import { ExpenseReportsController } from './expense-reports.controller';

const ids = new RandomUuidGenerator();
const clock = new FixedClock(new Date('2026-10-19T10:00:00Z'));

const employee: ActorContext = { userId: 'user-1', companyId: 'company-1', role: UserRole.EMPLOYEE };
const employer: ActorContext = { userId: 'boss', companyId: 'company-1', role: UserRole.EMPLOYER };
const PATH = '/companies/company-1/expense-reports';
const pdf = new TextEncoder().encode('%PDF-1.7\n%âãÏÓ\n');
const png = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);

let app: INestApplication;
let baseUrl: string;
let actor: ActorContext | undefined;

type Envelope = { status: number; message: string; data: unknown };
type Summary = { id: string; amount: string; vatAmount: string | null; status: string; proof: { fileName: string } | null };

async function send(method: string, path: string, body?: FormData | object): Promise<{ status: number; payload: Envelope }> {
  const json = body !== undefined && !(body instanceof FormData);
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: json ? { 'Content-Type': 'application/json' } : undefined,
    body: json ? JSON.stringify(body) : (body as FormData | undefined),
  });
  return { status: response.status, payload: (await response.json()) as Envelope };
}

function reportForm(
  fields: Record<string, string> = {},
  proof?: { fileName: string; content: Uint8Array; type?: string },
): FormData {
  const form = new FormData();
  const all = {
    date: '2026-09-28', category: 'TRAVEL', paymentMethod: 'PERSONAL_CARD', amount: '68,00',
    vatRate: '10', description: 'Montpellier – Lyon', project: 'Client Valette', ...fields,
  };
  for (const [key, value] of Object.entries(all)) {
    form.append(key, value);
  }
  if (proof !== undefined) {
    form.append('proof', new Blob([proof.content as Uint8Array<ArrayBuffer>], { type: proof.type ?? 'application/pdf' }), proof.fileName);
  }
  return form;
}

async function submitted(form = reportForm({}, { fileName: 'billet.pdf', content: pdf })): Promise<Summary> {
  return (await send('POST', PATH, form)).payload.data as Summary;
}

beforeAll(async () => {
  const reports = new InMemoryExpenseReportRepository(ids);
  const proofs = new InMemoryExpenseReportProofStorage(ids);
  const moduleRef = await Test.createTestingModule({
    controllers: [ExpenseReportsController, EmployerExpenseReportsController],
    providers: [
      { provide: IListExpenseReports, useFactory: () => new ListExpenseReportsUseCase(reports, clock) },
      { provide: IListEmployeeExpenseReports, useFactory: () => new ListEmployeeExpenseReportsUseCase(reports, clock) },
      { provide: ISubmitExpenseReport, useFactory: () => new SubmitExpenseReportUseCase(reports, proofs, clock) },
      { provide: IReviseExpenseReport, useFactory: () => new ReviseExpenseReportUseCase(reports, proofs) },
      { provide: IViewExpenseReportProof, useFactory: () => new ViewExpenseReportProofUseCase(reports, proofs) },
      { provide: IChangeExpenseReportStatus, useFactory: () => new ChangeExpenseReportStatusUseCase(reports, clock) },
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

describe('ExpenseReportsController', () => {
  it('submits a report with its receipt and lists it right away', async () => {
    const response = await send('POST', PATH, reportForm({}, { fileName: 'billet.pdf', content: pdf }));
    const list = await send('GET', `${PATH}?search=lyon&projects=Client%20Valette`);

    expect(response.status).toBe(201);
    expect(response.payload.data).toMatchObject({
      amount: '68.00', vatRate: 10, vatAmount: '6.18', status: 'SUBMITTED', proof: { fileName: 'billet.pdf', format: 'PDF' },
    });
    expect(list.payload.data).toMatchObject({ items: [{ description: 'Montpellier – Lyon' }] });
  });

  it('submits a report without receipt nor VAT', async () => {
    const form = reportForm({ category: 'PARKING', amount: '12' });
    form.delete('vatRate');
    form.delete('project');

    const response = await send('POST', PATH, form);

    expect(response).toMatchObject({ status: 201, payload: { data: { vatRate: null, project: null, proof: null } } });
  });

  it('refuses a malformed amount, an unknown category and a VAT rate outside the list', async () => {
    expect((await send('POST', PATH, reportForm({ amount: '12,345' }))).status).toBe(400);
    expect((await send('POST', PATH, reportForm({ category: 'TAXI' }))).status).toBe(400);
    expect((await send('POST', PATH, reportForm({ vatRate: '5.5' }))).status).toBe(400);
  });

  it('refuses a description above 250 characters and a project above 50', async () => {
    expect((await send('POST', PATH, reportForm({ description: 'd'.repeat(251) }))).status).toBe(400);
    expect((await send('POST', PATH, reportForm({ project: 'p'.repeat(51) }))).status).toBe(400);
  });

  it('refuses a receipt that is not a PDF, a JPG or a PNG', async () => {
    const response = await send('POST', PATH, reportForm({}, { fileName: 'faux.pdf', content: png }));

    expect(response).toMatchObject({ status: 400, payload: { message: 'UNSUPPORTED_FILE_FORMAT' } });
  });

  it('refuses a receipt above 10 MB before reading it whole', async () => {
    const tooLarge = new Uint8Array(EXPENSE_REPORT_PROOF_MAX_SIZE_BYTES + 1);
    tooLarge.set(pdf);

    const response = await send('POST', PATH, reportForm({}, { fileName: 'enorme.pdf', content: tooLarge }));

    expect(response).toMatchObject({ status: 413, payload: { message: 'FILE_TOO_LARGE' } });
  });

  it('corrects a report, replacing its receipt', async () => {
    const report = await submitted();

    const response = await send('PUT', `${PATH}/${report.id}`, reportForm(
      { amount: '70', keepProof: 'false' },
      { fileName: 'billet.png', content: png, type: 'image/png' },
    ));

    expect(response.payload).toMatchObject({ data: { amount: '70.00', vatAmount: '6.36', proof: { fileName: 'billet.png' } } });
  });

  it('opens the receipt for its owner and an employer of the company, never for a colleague', async () => {
    const report = await submitted();

    const own = await send('GET', `${PATH}/${report.id}/proof`);
    actor = employer;
    const employers = await send('GET', `${PATH}/${report.id}/proof`);
    actor = { ...employee, userId: 'user-2' };
    const colleagues = await send('GET', `${PATH}/${report.id}/proof`);

    expect(own.payload.data).toMatchObject({ fileName: 'billet.pdf', contentType: 'application/pdf' });
    expect(employers.status).toBe(200);
    expect(colleagues.status).toBe(403);
  });

  it('refuses a report of another company', async () => {
    const response = await send('GET', '/companies/company-2/expense-reports');

    expect(response.status).toBe(403);
  });
});

describe('EmployerExpenseReportsController', () => {
  it('lets the employer refund a report, which then refuses any correction', async () => {
    const report = await submitted();

    actor = employer;
    const refund = await send('PUT', `${PATH}/${report.id}/status`, { status: 'REFUNDED' });
    actor = employee;
    const correction = await send('PUT', `${PATH}/${report.id}`, reportForm({ keepProof: 'true' }));

    expect(refund.payload.data).toMatchObject({ status: 'REFUNDED', processedAt: '2026-10-19T10:00:00.000Z' });
    expect(correction).toMatchObject({ status: 409, payload: { message: 'ALREADY_PROCESSED' } });
  });

  it('refuses a status change by the employee', async () => {
    const report = await submitted();

    const response = await send('PUT', `${PATH}/${report.id}/status`, { status: 'REFUNDED' });

    expect(response.status).toBe(403);
  });

  it('lets the employer read the reports of an employee', async () => {
    await submitted();
    actor = employer;

    const response = await send('GET', '/companies/company-1/employees/user-1/expense-reports');

    expect(response.status).toBe(200);
    expect((response.payload.data as { total: number }).total).toBeGreaterThan(0);
  });

  it('refuses the list of an employee to the employee themself', async () => {
    const response = await send('GET', '/companies/company-1/employees/user-1/expense-reports');

    expect(response.status).toBe(403);
  });
});
