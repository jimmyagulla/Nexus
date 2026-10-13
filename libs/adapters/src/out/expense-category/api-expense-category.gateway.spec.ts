import { describe, expect, it } from 'vitest';
import { InMemoryHttpClient } from '../http/in-memory-http-client';
import { ApiExpenseCategoryGateway } from './api-expense-category.gateway';

const categories = [
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'cat-1', label: 'Hôtel' },
];

const authorized = { headers: { Authorization: 'Bearer token' } };

describe('ApiExpenseCategoryGateway', () => {
  it('lists the categories of the company', async () => {
    const http = new InMemoryHttpClient();
    http.reply('get', 'companies/c1/expense-categories', {
      status: 200,
      data: categories,
    });

    await expect(
      new ApiExpenseCategoryGateway(http).list('c1', 'token'),
    ).resolves.toEqual(categories);
    expect(http.calls).toEqual([
      {
        method: 'get',
        url: 'companies/c1/expense-categories',
        data: undefined,
        config: authorized,
      },
    ]);
  });

  it('adds a category to the company', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'companies/c1/expense-categories', {
      status: 201,
      data: categories,
    });

    await expect(
      new ApiExpenseCategoryGateway(http).add('c1', 'Hôtel', 'token'),
    ).resolves.toEqual(categories);
    expect(http.calls).toEqual([
      {
        method: 'post',
        url: 'companies/c1/expense-categories',
        data: { label: 'Hôtel' },
        config: authorized,
      },
    ]);
  });
});
