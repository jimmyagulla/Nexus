import { describe, expect, it } from 'vitest';
import { InMemoryHttpClient } from '@hexagonal-monorepo-template/adapters';
import { createAccountComposition } from './account.composition';

describe('createAccountComposition', () => {
  it('wires an account controller', () => {
    const deps = createAccountComposition(new InMemoryHttpClient());

    expect(deps.controller).toBeDefined();
    expect(deps.errorPresenter).toBeDefined();
    expect(deps.enrollmentPresenter).toBeDefined();
  });
});
