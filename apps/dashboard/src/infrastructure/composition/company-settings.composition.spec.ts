import { describe, expect, it } from 'vitest';
import {
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  CompanySettingsSnapshot,
  DayOfWeek,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { i18n } from '../ui/i18n/i18n';
import {
  CompanySettingsComposition,
  createCompanySettingsComposition,
} from './company-settings.composition';

const snapshot: CompanySettingsSnapshot = {
  id: 'c1',
  name: 'Acme',
  nonWorkingWeekdays: [DayOfWeek.SUNDAY],
  publicHolidays: [
    { id: 'ph-1', date: '2026-07-14', label: 'Fête nationale' },
  ],
};

const employerOfAcme: ActorContext = {
  userId: 'u1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

const strangerToEveryCompany: ActorContext = {
  userId: 'u1',
  companyId: null,
  role: null,
};

const envelope = { status: 200, data: snapshot };

function compositionFor(
  actor: ActorContext | null = employerOfAcme,
  token: string | null = 'jwt',
): { http: InMemoryHttpClient; deps: CompanySettingsComposition } {
  const http = new InMemoryHttpClient();
  http.reply('get', 'companies/c1/settings', envelope);
  http.reply('patch', 'companies/c1/name', envelope);
  http.reply('put', 'companies/c1/calendar/non-working-weekdays', envelope);
  http.reply('post', 'companies/c1/calendar/public-holidays', envelope);
  http.reply('delete', 'companies/c1/calendar/public-holidays/ph-1', envelope);

  return {
    http,
    deps: createCompanySettingsComposition(
      http,
      new InMemorySessionGateway(token, actor),
    ),
  };
}

describe('createCompanySettingsComposition', () => {
  it('does not let its caller choose the api the http client targets', () => {
    expect(createCompanySettingsComposition.length).toBe(2);
  });

  it('wires a controller that reads the settings of the session company', async () => {
    const { deps, http } = compositionFor();

    await expect(deps.controller.getSettings()).resolves.toEqual(snapshot);
    expect(http.calls).toEqual([
      {
        method: 'get',
        url: 'companies/c1/settings',
        data: undefined,
        config: { headers: { Authorization: 'Bearer jwt' } },
      },
    ]);
  });

  it('wires a controller that renames the session company', async () => {
    const { deps, http } = compositionFor();

    await deps.controller.renameCompany('Nexus');

    expect(http.calls).toEqual([
      {
        method: 'patch',
        url: 'companies/c1/name',
        data: { name: 'Nexus' },
        config: { headers: { Authorization: 'Bearer jwt' } },
      },
    ]);
  });

  it('wires a controller that replaces the non-working weekdays', async () => {
    const { deps, http } = compositionFor();

    await deps.controller.updateNonWorkingWeekdays([DayOfWeek.SATURDAY]);

    expect(http.calls).toEqual([
      {
        method: 'put',
        url: 'companies/c1/calendar/non-working-weekdays',
        data: { weekdays: [DayOfWeek.SATURDAY] },
        config: { headers: { Authorization: 'Bearer jwt' } },
      },
    ]);
  });

  it('wires a controller that retains a public holiday', async () => {
    const { deps, http } = compositionFor();

    await deps.controller.addPublicHoliday({
      date: '2026-11-11',
      label: 'Armistice',
    });

    expect(http.calls).toEqual([
      {
        method: 'post',
        url: 'companies/c1/calendar/public-holidays',
        data: { date: '2026-11-11', label: 'Armistice' },
        config: { headers: { Authorization: 'Bearer jwt' } },
      },
    ]);
  });

  it('wires a controller that drops a retained public holiday', async () => {
    const { deps, http } = compositionFor();

    await deps.controller.removePublicHoliday('ph-1');

    expect(http.calls).toEqual([
      {
        method: 'delete',
        url: 'companies/c1/calendar/public-holidays/ph-1',
        data: undefined,
        config: { headers: { Authorization: 'Bearer jwt' } },
      },
    ]);
  });

  it('provides the presenter the screen needs, not only the controller', () => {
    const { deps } = compositionFor();

    expect(deps.presenter.present(snapshot)).toMatchObject({
      name: 'Acme',
      selectedWeekdays: [DayOfWeek.SUNDAY],
      publicHolidays: [
        { id: 'ph-1', date: '14/07/2026', label: 'Fête nationale' },
      ],
    });
  });

  it('provides the error presenter the screen needs', () => {
    const { deps } = compositionFor();

    expect(deps.errorPresenter.present(new Error(ErrorCode.ACCESS_DENIED))).toBe(
      i18n.messages.errors.ACCESS_DENIED,
    );
  });

  it('refuses to reach the api when the session carries no company', async () => {
    const { deps, http } = compositionFor(strangerToEveryCompany);

    await expect(deps.controller.getSettings()).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
    expect(http.calls).toEqual([]);
  });

  it('refuses to reach the api when nobody is signed in', async () => {
    const { deps, http } = compositionFor(null, null);

    await expect(deps.controller.getSettings()).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
    expect(http.calls).toEqual([]);
  });
});
