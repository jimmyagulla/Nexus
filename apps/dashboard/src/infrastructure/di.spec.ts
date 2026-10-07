import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CompanySettingsSnapshot,
  DayOfWeek,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { fr } from './ui/i18n/fr';

type SessionRecord = {
  accessToken: string;
  userId: string;
  appMetadata: Readonly<Record<string, unknown>>;
};

type CapturedCall = {
  url: string;
  authorization: string | undefined;
};

type SentInit = {
  headers: Record<string, string>;
};

const supabase = vi.hoisted(() => ({
  session: null as SessionRecord | null,
}));

const transport = vi.hoisted(() => ({
  calls: [] as CapturedCall[],
  body: { status: 200, data: null } as unknown,
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

function installTransport(): void {
  vi.stubGlobal(
    'fetch',
    async (url: string, init: SentInit) => {
      transport.calls.push({
        url,
        authorization: init.headers['Authorization'],
      });
      return {
        ok: true,
        status: 200,
        json: async () => transport.body,
      };
    },
  );
}

async function companySettings() {
  return (await import('./di')).companySettingsComposition;
}

describe('dependency injection entry point', () => {
  beforeAll(() => {
    vi.stubEnv('VITE_AUTH_DISABLED', 'false');
    vi.stubEnv('VITE_API_URL', 'https://api.nexus.test/api');
    vi.stubEnv('VITE_SUPABASE_URL', 'https://project.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon');
    installTransport();
  });

  beforeEach(() => {
    transport.calls = [];
    transport.body = { status: 200, data: snapshot };
    supabase.session = {
      accessToken: 'jwt',
      userId: 'u1',
      appMetadata: { company_id: 'c1', role: UserRole.EMPLOYER },
    };
  });

  afterAll(() => {
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

  it('exports the controller and the presenters wired on the shared client', async () => {
    const di = await import('./di');

    expect(di.companySettingsController).toBe(di.companySettingsComposition.controller);
    expect(di.companySettingsPresenter).toBe(di.companySettingsComposition.presenter);
    expect(di.companySettingsErrorPresenter).toBe(
      di.companySettingsComposition.errorPresenter,
    );
  });

  it('wires a controller that reaches the configured api for the session company', async () => {
    const deps = await companySettings();

    await expect(deps.controller.getSettings()).resolves.toEqual(snapshot);
    expect(transport.calls).toEqual([
      {
        url: 'https://api.nexus.test/api/companies/c1/settings',
        authorization: 'Bearer jwt',
      },
    ]);
  });

  it('wires a controller that renames the session company on the api', async () => {
    const deps = await companySettings();

    await deps.controller.renameCompany('Nexus');

    expect(transport.calls.map((call) => call.url)).toEqual([
      'https://api.nexus.test/api/companies/c1/name',
    ]);
  });

  it('refuses to reach the api when nobody is signed in', async () => {
    supabase.session = null;
    const deps = await companySettings();

    await expect(deps.controller.getSettings()).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
    expect(transport.calls).toEqual([]);
  });

  it('refuses to reach the api when the session carries a blank company claim', async () => {
    supabase.session = {
      accessToken: 'jwt',
      userId: 'u1',
      appMetadata: { company_id: '', role: UserRole.EMPLOYER },
    };
    const deps = await companySettings();

    await expect(deps.controller.getSettings()).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
    expect(transport.calls).toEqual([]);
  });
});
