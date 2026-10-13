import { describe, expect, it } from 'vitest';
import {
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { i18n } from '../ui/i18n/i18n';
import { createExpenseCategoriesComposition } from './expense-categories.composition';

const employer: ActorContext = {
  userId: 'u1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

const categories = [{ id: 'restaurant', label: 'Restaurant' }];

describe('createExpenseCategoriesComposition', () => {
  it('wires a controller that reaches the categories of the session company', async () => {
    const http = new InMemoryHttpClient();
    http.reply('get', 'companies/c1/expense-categories', {
      status: 200,
      data: categories,
    });
    const deps = createExpenseCategoriesComposition(
      http,
      new InMemorySessionGateway('token', employer),
    );

    await expect(deps.controller.listCategories()).resolves.toEqual(categories);
    expect(http.calls[0]?.url).toBe('companies/c1/expense-categories');
  });

  it('wires a controller that adds a category to the session company', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'companies/c1/expense-categories', {
      status: 201,
      data: categories,
    });
    const deps = createExpenseCategoriesComposition(
      http,
      new InMemorySessionGateway('token', employer),
    );

    await deps.controller.addCategory('Restaurant');

    expect(http.calls[0]?.data).toEqual({ label: 'Restaurant' });
  });

  it('refuses to reach the api when nobody is signed in', async () => {
    const http = new InMemoryHttpClient();
    const deps = createExpenseCategoriesComposition(
      http,
      new InMemorySessionGateway(null, null),
    );

    await expect(deps.controller.listCategories()).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
    expect(http.calls).toEqual([]);
  });

  it('provides the presenters alongside the controller', () => {
    const deps = createExpenseCategoriesComposition(
      new InMemoryHttpClient(),
      new InMemorySessionGateway(null, null),
    );

    expect(deps.presenter.present(categories)).toEqual(categories);
    expect(deps.errorPresenter.present(new Error(ErrorCode.ACCESS_DENIED))).toBe(
      i18n.messages.errors.ACCESS_DENIED,
    );
  });
});
