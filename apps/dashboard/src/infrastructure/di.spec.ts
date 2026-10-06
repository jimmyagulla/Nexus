import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CompanySettingsSnapshot,
  DayOfWeek,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { CompanySettingsComposition } from './composition/company-settings.composition';
import { fr } from './ui/i18n/fr';

type SessionRecord = {
  accessToken: string;
  userId: string;
  appMetadata: Readonly<Record<string, unknown>>;
};

const supabase = vi.hoisted(() => ({
  session: null as SessionRecord | null,
}));

vi.mock('@hexagonal-monorepo-template/infrastructure/supabase/browser', () => ({
  SupabaseSessionClient: class {
    async getSession(): Promise<SessionRecord | null> {
      return supabase.session;
    }

    async refreshSession(): Promise<void> {
      return undefined;
    }
  },
}));

const snapshot: CompanySettingsSnapshot = {
  id: 'c1',
  name: 'Acme',
  nonWorkingWeekdays: [DayOfWeek.SUNDAY],
  publicHolidays: [
    { id: 'ph-1', date: '2026-07-14', label: 'Fête nationale' },
  ],
};

async function companySettings(): Promise<CompanySettingsComposition> {
  return (await import('./di')).getCompanySettingsComposition();
}

function stubApiReturning(data: unknown): { url: string; token?: string }[] {
  const calls: { url: string; token?: string }[] = [];

  vi.stubGlobal(
    'fetch',
    async (url: string, init: { headers: Record<string, string> }) => {
      calls.push({ url, token: init.headers['Authorization'] });
      return { ok: true, status: 200, json: async () => ({ data }) };
    },
  );

  return calls;
}

describe('dependency injection entry point', () => {
  beforeAll(() => {
    vi.stubEnv('VITE_AUTH_DISABLED', 'false');
    vi.stubEnv('VITE_API_URL', 'https://api.nexus.test/api');
    vi.stubEnv('VITE_SUPABASE_URL', 'https://project.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon');
  });

  beforeEach(() => {
    supabase.session = {
      accessToken: 'jwt',
      userId: 'u1',
      appMetadata: { company_id: 'c1', role: UserRole.EMPLOYER },
    };
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('provides the presenter alongside the controller', async () => {
    const deps = await companySettings();

    expect(deps.presenter.present(snapshot)).toMatchObject({
      name: 'Acme',
      publicHolidays: [
        { id: 'ph-1', date: '14/07/2026', label: 'Fête nationale' },
      ],
    });
  });

  it('provides the error presenter alongside the controller', async () => {
    const deps = await companySettings();

    expect(
      deps.errorPresenter.present(new Error(ErrorCode.ACCESS_DENIED)),
    ).toBe(fr.errors.ACCESS_DENIED);
  });

  it('names the weekdays in french through the presenter it provides', async () => {
    const deps = await companySettings();

    expect(deps.presenter.present(snapshot).weekdays).toContainEqual({
      value: DayOfWeek.SUNDAY,
      label: fr.days.SUNDAY,
      selected: true,
    });
  });

  it('wires a controller that reaches the configured api for the session company', async () => {
    const calls = stubApiReturning(snapshot);
    const deps = await companySettings();

    await expect(deps.controller.getSettings()).resolves.toEqual(snapshot);
    expect(calls).toEqual([
      {
        url: 'https://api.nexus.test/api/companies/c1/settings',
        token: 'Bearer jwt',
      },
    ]);
  });

  it('wires a controller that renames the session company on the api', async () => {
    const calls = stubApiReturning(snapshot);
    const deps = await companySettings();

    await deps.controller.renameCompany('Nexus');

    expect(calls.map((call) => call.url)).toEqual([
      'https://api.nexus.test/api/companies/c1/name',
    ]);
  });

  it('refuses to reach the api when nobody is signed in', async () => {
    supabase.session = null;
    const calls = stubApiReturning(snapshot);
    const deps = await companySettings();

    await expect(deps.controller.getSettings()).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
    expect(calls).toEqual([]);
  });

  it('refuses to reach the api when the session carries a blank company claim', async () => {
    supabase.session = {
      accessToken: 'jwt',
      userId: 'u1',
      appMetadata: { company_id: '', role: UserRole.EMPLOYER },
    };
    const calls = stubApiReturning(snapshot);
    const deps = await companySettings();

    await expect(deps.controller.getSettings()).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
    expect(calls).toEqual([]);
  });
});
