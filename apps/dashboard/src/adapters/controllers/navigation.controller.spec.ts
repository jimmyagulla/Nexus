import { describe, expect, it } from 'vitest';
import { UserRole } from '@hexagonal-monorepo-template/domain';
import { NavigationController } from './navigation.controller';

describe('NavigationController', () => {
  it('gives the role of the current session', async () => {
    const controller = new NavigationController({
      execute: async () => UserRole.ACCOUNTANT,
    });

    await expect(controller.currentRole()).resolves.toBe(UserRole.ACCOUNTANT);
  });

  it('gives no role when nobody is signed in', async () => {
    const controller = new NavigationController({ execute: async () => null });

    await expect(controller.currentRole()).resolves.toBeNull();
  });
});
