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
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import {
  IAddExpenseCategory,
  IListExpenseCategories,
} from '@hexagonal-monorepo-template/ports';
import { ApiExceptionFilter } from '../common/filters/api-exception.filter';
import { AuthenticatedRequest } from '../common/guards/authenticated-request';
import { SuccessResponseInterceptor } from '../common/interceptors/success-response.interceptor';
import { createValidationPipe } from '../common/pipes/create-validation.pipe';
import { ExpenseCategoryController } from './expense-category.controller';

const listCategories = { execute: vi.fn<IListExpenseCategories['execute']>() };
const addCategory = { execute: vi.fn<IAddExpenseCategory['execute']>() };

const employer: ActorContext = {
  userId: 'u1',
  companyId: 'company-1',
  role: UserRole.EMPLOYER,
};

const categories = [
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'cat-1', label: 'Hôtel' },
];

const PATH = '/companies/company-1/expense-categories';

let app: INestApplication;
let baseUrl: string;
let actor: ActorContext | undefined;

async function send(
  method: string,
  body?: unknown,
): Promise<{ status: number; payload: unknown }> {
  const response = await fetch(`${baseUrl}${PATH}`, {
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
    controllers: [ExpenseCategoryController],
    providers: [
      { provide: IListExpenseCategories, useValue: listCategories },
      { provide: IAddExpenseCategory, useValue: addCategory },
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
  listCategories.execute.mockReset();
  listCategories.execute.mockResolvedValue(categories);
  addCategory.execute.mockReset();
  addCategory.execute.mockResolvedValue(categories);
});

describe('ExpenseCategoryController', () => {
  describe('GET /companies/:companyId/expense-categories', () => {
    it('answers 200 with the categories', async () => {
      await expect(send('GET')).resolves.toEqual({
        status: 200,
        payload: { status: 200, message: 'Success', data: categories },
      });
    });

    it('lets an employee list the categories', async () => {
      actor = { ...employer, role: UserRole.EMPLOYEE };

      expect((await send('GET')).status).toBe(200);
    });

    it('answers 403 for the accounting firm', async () => {
      actor = { ...employer, role: UserRole.ACCOUNTANT };

      expect((await send('GET')).status).toBe(403);
    });
  });

  describe('POST /companies/:companyId/expense-categories', () => {
    it('answers 201 with the categories', async () => {
      await expect(send('POST', { label: 'Hôtel' })).resolves.toEqual({
        status: 201,
        payload: { status: 201, message: 'Success', data: categories },
      });
    });

    it('hands the label to the use case', async () => {
      await send('POST', { label: 'Hôtel' });

      expect(addCategory.execute).toHaveBeenCalledWith({
        actor: employer,
        companyId: 'company-1',
        label: 'Hôtel',
      });
    });

    it('answers 400 when the label is empty', async () => {
      expect((await send('POST', { label: '' })).status).toBe(400);
      expect(addCategory.execute).not.toHaveBeenCalled();
    });

    it('answers 403 when the actor is an employee', async () => {
      actor = { ...employer, role: UserRole.EMPLOYEE };

      expect((await send('POST', { label: 'Hôtel' })).status).toBe(403);
      expect(addCategory.execute).not.toHaveBeenCalled();
    });

    it('answers 400 with the code when the category already exists', async () => {
      addCategory.execute.mockRejectedValue(
        new Error(ErrorCode.POTENTIAL_DUPLICATE),
      );

      await expect(send('POST', { label: 'Train' })).resolves.toEqual({
        status: 400,
        payload: { status: 400, message: ErrorCode.POTENTIAL_DUPLICATE },
      });
    });
  });
});
