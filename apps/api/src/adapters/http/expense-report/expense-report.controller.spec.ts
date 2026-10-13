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
  IAttachReceipt,
  ICreateExpenseReport,
  IGetExpenseReport,
  IGetReceipt,
  IListExpenseReports,
  IRemoveExpense,
  ISubmitExpenseReport,
  IUpdateExpense,
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
const updateExpense = { execute: vi.fn<IUpdateExpense['execute']>() };
const removeExpense = { execute: vi.fn<IRemoveExpense['execute']>() };
const attachReceipt = { execute: vi.fn<IAttachReceipt['execute']>() };
const submitReport = { execute: vi.fn<ISubmitExpenseReport['execute']>() };
const getReceipt = { execute: vi.fn<IGetReceipt['execute']>() };

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
  total: 0,
  receipts: [],
  expenses: [],
};

const REPORTS_PATH = '/companies/company-1/expense-reports';
const REPORT_PATH = `${REPORTS_PATH}/r1`;
const EXPENSES_PATH = `${REPORT_PATH}/expenses`;
const EXPENSE_PATH = `${EXPENSES_PATH}/x1`;
const RECEIPTS_PATH = `${REPORT_PATH}/receipts`;
const RECEIPT_PATH = `${RECEIPTS_PATH}/f1`;
const SUBMISSION_PATH = `${REPORT_PATH}/submission`;

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
      { provide: IUpdateExpense, useValue: updateExpense },
      { provide: IRemoveExpense, useValue: removeExpense },
      { provide: IAttachReceipt, useValue: attachReceipt },
      { provide: ISubmitExpenseReport, useValue: submitReport },
      { provide: IGetReceipt, useValue: getReceipt },
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
  for (const useCase of [
    createReport,
    addExpense,
    getReport,
    updateExpense,
    removeExpense,
    attachReceipt,
    submitReport,
  ]) {
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

    it('lets the employer list the reports', async () => {
      actor = { ...employee, role: UserRole.EMPLOYER };

      expect((await send('GET', REPORTS_PATH)).status).toBe(200);
    });

    it('answers 403 for the accounting firm', async () => {
      actor = { ...employee, role: UserRole.ACCOUNTANT };

      expect((await send('GET', REPORTS_PATH)).status).toBe(403);
      expect(listReports.execute).not.toHaveBeenCalled();
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

    it('lets the employer read a report', async () => {
      actor = { ...employee, role: UserRole.EMPLOYER };

      expect((await send('GET', REPORT_PATH)).status).toBe(200);
      expect(getReport.execute).toHaveBeenCalledWith({
        actor: { ...employee, role: UserRole.EMPLOYER },
        companyId: 'company-1',
        reportId: 'r1',
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

  describe('POST /companies/:companyId/expense-reports/:expenseReportId/receipts', () => {
    const receiptBody = {
      fileName: 'ticket.pdf',
      mimeType: 'application/pdf',
      contentBase64: 'SGVsbG8=',
    };

    it('answers 201 with the updated report', async () => {
      await expect(send('POST', RECEIPTS_PATH, receiptBody)).resolves.toEqual({
        status: 201,
        payload: { status: 201, message: 'Success', data: report },
      });
    });

    it('hands the decoded file to the use case', async () => {
      await send('POST', RECEIPTS_PATH, receiptBody);

      expect(attachReceipt.execute).toHaveBeenCalledWith({
        actor: employee,
        companyId: 'company-1',
        reportId: 'r1',
        receipt: {
          fileName: 'ticket.pdf',
          mimeType: 'application/pdf',
          content: new Uint8Array([72, 101, 108, 108, 111]),
          expenseId: null,
        },
      });
    });

    it('hands the expense the receipt proves', async () => {
      await send('POST', RECEIPTS_PATH, { ...receiptBody, expenseId: 'x1' });

      expect(attachReceipt.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          receipt: expect.objectContaining({ expenseId: 'x1' }),
        }),
      );
    });

    it('answers 400 when the content is missing', async () => {
      const { status } = await send('POST', RECEIPTS_PATH, {
        fileName: 'ticket.pdf',
        mimeType: 'application/pdf',
      });

      expect(status).toBe(400);
      expect(attachReceipt.execute).not.toHaveBeenCalled();
    });

    it('answers 400 with the code when the file is invalid', async () => {
      attachReceipt.execute.mockRejectedValue(new Error(ErrorCode.INVALID_FILE));

      await expect(send('POST', RECEIPTS_PATH, receiptBody)).resolves.toEqual({
        status: 400,
        payload: { status: 400, message: ErrorCode.INVALID_FILE },
      });
    });

    it('answers 403 when the actor is an employer', async () => {
      actor = { ...employee, role: UserRole.EMPLOYER };

      expect((await send('POST', RECEIPTS_PATH, receiptBody)).status).toBe(403);
      expect(attachReceipt.execute).not.toHaveBeenCalled();
    });
  });

  describe('GET /companies/:companyId/expense-reports/:expenseReportId/receipts/:receiptId', () => {
    beforeEach(() => {
      getReceipt.execute.mockReset();
      getReceipt.execute.mockResolvedValue({
        id: 'f1',
        fileName: 'ticket.pdf',
        mimeType: 'application/pdf',
        content: new Uint8Array([72, 101, 108, 108, 111]),
      });
    });

    it('answers 200 with the file encoded in base64', async () => {
      await expect(send('GET', RECEIPT_PATH)).resolves.toEqual({
        status: 200,
        payload: {
          status: 200,
          message: 'Success',
          data: {
            id: 'f1',
            fileName: 'ticket.pdf',
            mimeType: 'application/pdf',
            contentBase64: 'SGVsbG8=',
          },
        },
      });
    });

    it('hands the receipt of the path to the use case', async () => {
      await send('GET', RECEIPT_PATH);

      expect(getReceipt.execute).toHaveBeenCalledWith({
        actor: employee,
        companyId: 'company-1',
        reportId: 'r1',
        receiptId: 'f1',
      });
    });

    it('lets the employer download a receipt', async () => {
      actor = { ...employee, role: UserRole.EMPLOYER };

      expect((await send('GET', RECEIPT_PATH)).status).toBe(200);
    });

    it('answers 403 for the accounting firm', async () => {
      actor = { ...employee, role: UserRole.ACCOUNTANT };

      expect((await send('GET', RECEIPT_PATH)).status).toBe(403);
      expect(getReceipt.execute).not.toHaveBeenCalled();
    });

    it('answers 403 when the use case denies access', async () => {
      getReceipt.execute.mockRejectedValue(new Error(ErrorCode.ACCESS_DENIED));

      expect((await send('GET', RECEIPT_PATH)).status).toBe(403);
    });
  });

  describe('POST /companies/:companyId/expense-reports/:expenseReportId/submission', () => {
    it('answers 201 with the submitted report', async () => {
      await expect(send('POST', SUBMISSION_PATH)).resolves.toEqual({
        status: 201,
        payload: { status: 201, message: 'Success', data: report },
      });
    });

    it('hands the report of the path to the use case', async () => {
      await send('POST', SUBMISSION_PATH);

      expect(submitReport.execute).toHaveBeenCalledWith({
        actor: employee,
        companyId: 'company-1',
        reportId: 'r1',
      });
    });

    it('answers 400 with the code when a receipt is missing', async () => {
      submitReport.execute.mockRejectedValue(
        new Error(ErrorCode.MISSING_DOCUMENT),
      );

      await expect(send('POST', SUBMISSION_PATH)).resolves.toEqual({
        status: 400,
        payload: { status: 400, message: ErrorCode.MISSING_DOCUMENT },
      });
    });

    it('answers 403 when the actor is an employer', async () => {
      actor = { ...employee, role: UserRole.EMPLOYER };

      expect((await send('POST', SUBMISSION_PATH)).status).toBe(403);
      expect(submitReport.execute).not.toHaveBeenCalled();
    });
  });

  describe('PATCH /companies/:companyId/expense-reports/:expenseReportId/expenses/:expenseId', () => {
    it('answers 200 with the updated report', async () => {
      await expect(send('PATCH', EXPENSE_PATH, expenseBody)).resolves.toEqual({
        status: 200,
        payload: { status: 200, message: 'Success', data: report },
      });
    });

    it('hands the expense of the path and the submitted fields to the use case', async () => {
      await send('PATCH', EXPENSE_PATH, { ...expenseBody, vat: 5 });

      expect(updateExpense.execute).toHaveBeenCalledWith({
        actor: employee,
        companyId: 'company-1',
        reportId: 'r1',
        expenseId: 'x1',
        expense: { ...expenseBody, vat: 5 },
      });
    });

    it('answers 400 when the date is malformed', async () => {
      const { status } = await send('PATCH', EXPENSE_PATH, {
        ...expenseBody,
        date: 'demain',
      });

      expect(status).toBe(400);
      expect(updateExpense.execute).not.toHaveBeenCalled();
    });

    it('answers 400 with the code when the report is no longer a draft', async () => {
      updateExpense.execute.mockRejectedValue(
        new Error(ErrorCode.REQUEST_ALREADY_PROCESSED),
      );

      await expect(send('PATCH', EXPENSE_PATH, expenseBody)).resolves.toEqual({
        status: 400,
        payload: { status: 400, message: ErrorCode.REQUEST_ALREADY_PROCESSED },
      });
    });

    it('answers 403 when the actor is an employer', async () => {
      actor = { ...employee, role: UserRole.EMPLOYER };

      expect((await send('PATCH', EXPENSE_PATH, expenseBody)).status).toBe(403);
    });
  });

  describe('DELETE /companies/:companyId/expense-reports/:expenseReportId/expenses/:expenseId', () => {
    it('answers 200 with the updated report', async () => {
      await expect(send('DELETE', EXPENSE_PATH)).resolves.toEqual({
        status: 200,
        payload: { status: 200, message: 'Success', data: report },
      });
    });

    it('hands the expense of the path to the use case', async () => {
      await send('DELETE', EXPENSE_PATH);

      expect(removeExpense.execute).toHaveBeenCalledWith({
        actor: employee,
        companyId: 'company-1',
        reportId: 'r1',
        expenseId: 'x1',
      });
    });

    it('answers 403 when the use case denies access', async () => {
      removeExpense.execute.mockRejectedValue(new Error(ErrorCode.ACCESS_DENIED));

      expect((await send('DELETE', EXPENSE_PATH)).status).toBe(403);
    });

    it('answers 403 when the actor is an employer', async () => {
      actor = { ...employee, role: UserRole.EMPLOYER };

      expect((await send('DELETE', EXPENSE_PATH)).status).toBe(403);
      expect(removeExpense.execute).not.toHaveBeenCalled();
    });
  });
});
