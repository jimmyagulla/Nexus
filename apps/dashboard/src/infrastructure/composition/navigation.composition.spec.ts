import { describe, expect, it } from 'vitest';
import { InMemorySessionGateway } from '@hexagonal-monorepo-template/adapters';
import { UserRole } from '@hexagonal-monorepo-template/domain';
import { createNavigationComposition } from './navigation.composition';

describe('createNavigationComposition', () => {
  it('wires a controller that reads the role of the session', async () => {
    const deps = createNavigationComposition(
      new InMemorySessionGateway('jwt', {
        userId: 'u1',
        companyId: 'c1',
        role: UserRole.ACCOUNTANT,
      }),
    );

    await expect(deps.controller.currentRole()).resolves.toBe(
      UserRole.ACCOUNTANT,
    );
  });

  it('provides the presenter the shell needs', () => {
    const deps = createNavigationComposition(
      new InMemorySessionGateway(null, null),
    );

    expect(deps.presenter.present(UserRole.ACCOUNTANT)).toHaveLength(1);
  });
});
