import { describe, expect, it } from 'vitest';
import { ErrorCode, UserRole } from '@hexagonal-monorepo-template/domain';
import { LoadCompanySettingsUseCase } from './load-company-settings.use-case';

describe('LoadCompanySettingsUseCase', () => {
  it('loads settings for the actor company', async () => {
    const snapshot = {
      id: 'c1',
      name: 'Acme',
      nonWorkingWeekdays: [],
      publicHolidays: [],
    };
    const useCase = new LoadCompanySettingsUseCase(
      {
        getAccessToken: async () => 'token',
        getActor: async () => ({
          userId: 'u1',
          companyId: 'c1',
          role: UserRole.EMPLOYER,
        }),
        refresh: async () => undefined,
      },
      {
        create: async () => snapshot,
        get: async (companyId, token) => {
          expect(companyId).toBe('c1');
          expect(token).toBe('token');
          return snapshot;
        },
        rename: async () => snapshot,
        setNonWorkingWeekdays: async () => snapshot,
        addPublicHoliday: async () => snapshot,
        updatePublicHoliday: async () => snapshot,
        removePublicHoliday: async () => snapshot,
      },
    );

    await expect(useCase.execute()).resolves.toEqual(snapshot);
  });

  it('refuses when the session has no company', async () => {
    const useCase = new LoadCompanySettingsUseCase(
      {
        getAccessToken: async () => 'token',
        getActor: async () => ({
          userId: 'u1',
          companyId: null,
          role: null,
        }),
        refresh: async () => undefined,
      },
      {
        create: async () => {
          throw new Error('unused');
        },
        get: async () => {
          throw new Error('unused');
        },
        rename: async () => {
          throw new Error('unused');
        },
        setNonWorkingWeekdays: async () => {
          throw new Error('unused');
        },
        addPublicHoliday: async () => {
          throw new Error('unused');
        },
        updatePublicHoliday: async () => {
          throw new Error('unused');
        },
        removePublicHoliday: async () => {
          throw new Error('unused');
        },
      },
    );

    await expect(useCase.execute()).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
