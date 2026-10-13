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
import {
  createPresenceComposition,
  PresenceComposition,
} from './presence.composition';

const camille = {
  id: 'p1',
  employeeId: 'e1',
  employeeName: 'Camille Martin',
  month: '2026-10',
  workedDays: 22,
  leaves: [],
  absences: [],
  sickLeaves: [],
  overtime: [],
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

function compositionFor(
  actor: ActorContext | null = employerOfAcme,
  token: string | null = 'jwt',
): { http: InMemoryHttpClient; deps: PresenceComposition } {
  const http = new InMemoryHttpClient();
  http.reply('get', 'companies/c1/presences', {
    status: 200,
    data: {
      presences: [camille],
      employees: [{ id: 'e1', fullName: 'Camille Martin' }],
      canManage: true,
    },
  });
  http.reply('post', 'companies/c1/presences', { status: 201, data: camille });

  return {
    http,
    deps: createPresenceComposition(
      http,
      new InMemorySessionGateway(token, actor),
    ),
  };
}

describe('createPresenceComposition', () => {
  it('does not let its caller choose the api the http client targets', () => {
    expect(createPresenceComposition.length).toBe(2);
  });

  it('wires a controller that lists the presences of the session company', async () => {
    const { deps, http } = compositionFor();

    await expect(deps.controller.list()).resolves.toMatchObject({
      presences: [camille],
      canManage: true,
    });
    expect(http.calls).toEqual([
      {
        method: 'get',
        url: 'companies/c1/presences',
        data: undefined,
        config: { headers: { Authorization: 'Bearer jwt' } },
      },
    ]);
  });

  it('wires a controller that opens a month for the session company', async () => {
    const { deps, http } = compositionFor();

    await deps.controller.open({ employeeId: 'e1', month: '2026-10' });

    expect(http.calls).toEqual([
      {
        method: 'post',
        url: 'companies/c1/presences',
        data: { employeeId: 'e1', month: '2026-10' },
        config: { headers: { Authorization: 'Bearer jwt' } },
      },
    ]);
  });

  it('provides the presenter the screen needs, not only the controller', () => {
    const { deps } = compositionFor();

    expect(
      deps.presenter.present({
        presences: [camille],
        employees: [],
        canManage: true,
      }).rows,
    ).toEqual([
      {
        id: 'p1',
        employeeName: 'Camille Martin',
        monthLabel: 'Octobre 2026',
        workedDays: 22,
        leaves: [],
        absences: [],
        sickLeaves: [],
        overtime: [],
      },
    ]);
  });

  it('provides the error presenter the screen needs', () => {
    const { deps } = compositionFor();

    expect(deps.errorPresenter.present(new Error(ErrorCode.ACCESS_DENIED))).toBe(
      i18n.messages.errors.ACCESS_DENIED,
    );
  });

  it('refuses to reach the api when the session carries no company', async () => {
    const { deps, http } = compositionFor(strangerToEveryCompany);

    await expect(deps.controller.list()).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
    expect(http.calls).toEqual([]);
  });

  it('refuses to reach the api when nobody is signed in', async () => {
    const { deps, http } = compositionFor(null, null);

    await expect(deps.controller.list()).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
    expect(http.calls).toEqual([]);
  });
});
