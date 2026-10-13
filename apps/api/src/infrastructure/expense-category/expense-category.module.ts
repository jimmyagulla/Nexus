import { Module } from '@nestjs/common';
import {
  AddExpenseCategoryUseCase,
  ListExpenseCategoriesUseCase,
} from '@hexagonal-monorepo-template/application';
import { InMemoryExpenseCategoryRepository } from '@hexagonal-monorepo-template/adapters';
import {
  IAddExpenseCategory,
  IExpenseCategoryRepository,
  IListExpenseCategories,
} from '@hexagonal-monorepo-template/ports';
import { ExpenseCategoryController } from '../../adapters/http/expense-category/expense-category.controller';
import { PrismaExpenseCategoryRepository } from '../../adapters/out/expense-category/prisma-expense-category.repository';
import { API_CONFIG, type ApiConfig } from '../config/load-api-config';
import { IPrismaDb, type PrismaDb } from '../prisma/prisma-db.port';

@Module({
  controllers: [ExpenseCategoryController],
  providers: [
    {
      provide: IExpenseCategoryRepository,
      useFactory: (config: ApiConfig, prisma?: PrismaDb) => {
        if (config.persistence === 'postgres' && prisma !== undefined) {
          return new PrismaExpenseCategoryRepository(prisma);
        }
        return new InMemoryExpenseCategoryRepository();
      },
      inject: [API_CONFIG, { token: IPrismaDb, optional: true }],
    },
    {
      provide: IListExpenseCategories,
      useFactory: (categories: IExpenseCategoryRepository) =>
        new ListExpenseCategoriesUseCase(categories),
      inject: [IExpenseCategoryRepository],
    },
    {
      provide: IAddExpenseCategory,
      useFactory: (categories: IExpenseCategoryRepository) =>
        new AddExpenseCategoryUseCase(categories),
      inject: [IExpenseCategoryRepository],
    },
  ],
  exports: [IExpenseCategoryRepository],
})
export class ExpenseCategoryModule {}
