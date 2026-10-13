import { describe, expect, it } from 'vitest';
import { ExpenseCategoriesController } from './expense-categories.controller';

const categories = [
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'cat-1', label: 'Hôtel' },
];

describe('ExpenseCategoriesController', () => {
  it('lists the categories', async () => {
    const controller = new ExpenseCategoriesController(
      { execute: async () => categories },
      { execute: async () => categories },
    );

    await expect(controller.listCategories()).resolves.toEqual(categories);
  });

  it('adds a category from its label', async () => {
    const added: string[] = [];
    const controller = new ExpenseCategoriesController(
      { execute: async () => [] },
      {
        execute: async (label) => {
          added.push(label);
          return categories;
        },
      },
    );

    await expect(controller.addCategory('Hôtel')).resolves.toEqual(categories);
    expect(added).toEqual(['Hôtel']);
  });
});
