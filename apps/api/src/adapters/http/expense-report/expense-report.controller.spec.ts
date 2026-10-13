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
  ErrorCode,
  ExpenseReportSnapshot,
  ExpenseReportStatus,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import {
  IAddExpense,
  ICreateExpenseReport,
  IGetExpenseReport,
  IListExpenseReports,
} from '@hexagonal-monorepo-template/ports';
import { ApiExceptionFilter } from '../common/filters/api-exception.filter';
import { AuthenticatedRequest } from '../common/guards/authenticated-request';
import { SuccessResponseInterceptor } from '../common/interceptors/success-response.interceptor';
import { createValidationPipe } from '../common/pipes/create-validation.pipe';
import { ExpenseReportController } from './expense-report.controller';

const createReport = { execute: vi.fn<ICreateExpenseReport['execute']>() };
const addExpense = { execute: vi.fn<IAddExpense['execute']>() };
const getReport = { execute: vi.fn<IGetExpenseReport['execute']>() };
const listReports = { execute: vi.fn<IListExpenseReports['execute']>() };

const employee: ActorContext = {
  userId: 'e1',
  companyId: 'company-1',
  role: UserRole.EMPLOYEE,
};

const report: ExpenseReportSnapshot = {
  id: 'r1',
  companyId: 'company-1',
  employeeId: 'e1',
  label: 'Déplacement Lyon',
  status: ExpenseReportStatus.DRAFT,
  expenses: [],
};

const REPORTS_PATH = '/companies/company-1/expense-reports';
const REPORT_PATH = `${REPORTS_PATH}/r1`;
const EXPENSES_PATH = `${REPORT_PATH}/expenses`;

const expenseBody = {
  date: '2026-10-05',
  categoryId: 'restaurant',
  amount: 45,
  paymentMethod: 'Carte',
  description: 'Déjeuner',
  assignment: 'Client Dupont',
};

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
    controllers: [ExpenseReportController],
    providers: [
      { provide: ICreateExpenseReport, useValue: createReport },
      { provide: IAddExpense, useValue: addExpense },
      { provide: IGetExpenseReport, useValue: getReport },
      { provide: IListExpenseReports, useValue: listReports },
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
  actor = employee;
  for (const useCase of [createReport, addExpense, getReport]) {
    useCase.execute.mockReset();
    useCase.execute.mockResolvedValue(report);
  }
  listReports.execute.mockReset();
  listReports.execute.mockResolvedValue({ canCreate: true, reports: [report] });
});

describe('ExpenseReportController', () => {
  describe('POST /companies/:companyId/expense-reports', () => {
    it('answers 201 with the draft report', async () => {
      await expect(
        send('POST', REPORTS_PATH, { label: 'Déplacement Lyon' }),
      ).resolves.toEqual({
        status: 201,
        payload: { status: 201, message: 'Success', data: report },
      });
    });

    it('hands the label to the use case', async () => {
      await send('POST', REPORTS_PATH, { label: 'Déplacement Lyon' });

      expect(createReport.execute).toHaveBeenCalledWith({
        actor: employee,
        companyId: 'company-1',
        label: 'Déplacement Lyon',
      });
    });

    it('answers 400 when the label is empty', async () => {
      const { status } = await send('POST', REPORTS_PATH, { label: '' });

      expect(status).toBe(400);
      expect(createReport.execute).not.toHaveBeenCalled();
    });

    it('answers 403 when the actor is an employer', async () => {
      actor = { ...employee, role: UserRole.EMPLOYER };

      const { status } = await send('POST', REPORTS_PATH, { label: 'Lyon' });

      expect(status).toBe(403);
      expect(createReport.execute).not.toHaveBeenCalled();
    });

    it('answers 400 with the code when the employee is inactive', async () => {
      createReport.execute.mockRejectedValue(
        new Error(ErrorCode.INACTIVE_EMPLOYEE),
      );

      await expect(
        send('POST', REPORTS_PATH, { label: 'Lyon' }),
      ).resolves.toEqual({
        status: 400,
        payload: { status: 400, message: ErrorCode.INACTIVE_EMPLOYEE },
      });
    });
  });

  describe('GET /companies/:companyId/expense-reports', () => {
    it('answers 200 with the reports of the employee', async () => {
      await expect(send('GET', REPORTS_PATH)).resolves.toEqual({
        status: 200,
        payload: {
          status: 200,
          message: 'Success',
          data: { canCreate: true, reports: [report] },
        },
      });
    });

    it('answers 403 when the actor is bound to another company', async () => {
      actor = { ...employee, companyId: 'company-2' };

      expect((await send('GET', REPORTS_PATH)).status).toBe(403);
    });
  });

  describe('GET /companies/:companyId/expense-reports/:expenseReportId', () => {
    it('answers 200 with the report', async () => {
      await expect(send('GET', REPORT_PATH)).resolves.toEqual({
        status: 200,
        payload: { status: 200, message: 'Success', data: report },
      });
    });

    it('hands the report of the path to the use case', async () => {
      await send('GET', REPORT_PATH);

      expect(getReport.execute).toHaveBeenCalledWith({
        actor: employee,
        companyId: 'company-1',
        reportId: 'r1',
      });
    });

    it('answers 403 when the use case denies access', async () => {
      getReport.execute.mockRejectedValue(new Error(ErrorCode.ACCESS_DENIED));

      await expect(send('GET', REPORT_PATH)).resolves.toEqual({
        status: 403,
        payload: { status: 403, message: ErrorCode.ACCESS_DENIED },
      });
    });
  });

  describe('POST /companies/:companyId/expense-reports/:expenseReportId/expenses', () => {
    it('answers 201 with the updated report', async () => {
      await expect(send('POST', EXPENSES_PATH, expenseBody)).resolves.toEqual({
        status: 201,
        payload: { status: 201, message: 'Success', data: report },
      });
    });

    it('hands the expense with a missing VAT as null', async () => {
      await send('POST', EXPENSES_PATH, expenseBody);

      expect(addExpense.execute).toHaveBeenCalledWith({
        actor: employee,
        companyId: 'company-1',
        reportId: 'r1',
        expense: { ...expenseBody, vat: null },
      });
    });

    it('hands the VAT when it is provided', async () => {
      await send('POST', EXPENSES_PATH, { ...expenseBody, vat: 7.5 });

      expect(addExpense.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          expense: expect.objectContaining({ vat: 7.5 }),
        }),
      );
    });

    it('answers 400 when the date is malformed', async () => {
      const { status } = await send('POST', EXPENSES_PATH, {
        ...expenseBody,
        date: '05/10/2026',
      });

      expect(status).toBe(400);
      expect(addExpense.execute).not.toHaveBeenCalled();
    });

    it('answers 400 when the amount is not a number', async () => {
      const { status } = await send('POST', EXPENSES_PATH, {
        ...expenseBody,
        amount: 'beaucoup',
      });

      expect(status).toBe(400);
    });

    it('answers 400 with the code when the amount is zero', async () => {
      addExpense.execute.mockRejectedValue(new Error(ErrorCode.INVALID_AMOUNT));

      await expect(
        send('POST', EXPENSES_PATH, { ...expenseBody, amount: 0 }),
      ).resolves.toEqual({
        status: 400,
        payload: { status: 400, message: ErrorCode.INVALID_AMOUNT },
      });
    });

    it('answers 400 with the code when the VAT exceeds the amount', async () => {
      addExpense.execute.mockRejectedValue(new Error(ErrorCode.INVALID_VAT));

      await expect(
        send('POST', EXPENSES_PATH, { ...expenseBody, vat: 99 }),
      ).resolves.toEqual({
        status: 400,
        payload: { status: 400, message: ErrorCode.INVALID_VAT },
      });
    });

    it('answers 403 when the actor is an employer', async () => {
      actor = { ...employee, role: UserRole.EMPLOYER };

      expect((await send('POST', EXPENSES_PATH, expenseBody)).status).toBe(403);
      expect(addExpense.execute).not.toHaveBeenCalled();
    });
  });
});
