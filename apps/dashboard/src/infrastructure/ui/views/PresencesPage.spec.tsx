import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ErrorCode,
  PresenceListSnapshot,
  PresenceSnapshot,
} from '@hexagonal-monorepo-template/domain';
import { PresenceController } from '../../../adapters/controllers/presence.controller';
import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { PresencePresenter } from '../../../adapters/presenters/presence.presenter';
import { PresenceComposition } from '../../composition/presence.composition';
import { i18n } from '../i18n/i18n';
import { PresencesPage } from './PresencesPage';

const camille: PresenceSnapshot = {
  id: 'p1',
  employeeId: 'e1',
  employeeName: 'Camille Martin',
  month: '2026-10',
  workedDays: 22,
  proposedWorkedDays: 22,
  adjustments: [],
  leaves: [],
  absences: [],
  sickLeaves: [],
  overtime: [],
};

const listWith = (
  presences: PresenceSnapshot[],
  canManage = true,
): PresenceListSnapshot => ({
  presences,
  employees: [{ id: 'e1', companyId: 'c1', fullName: 'Camille Martin' }],
  canManage,
});

function compositionOf(
  list: () => Promise<PresenceListSnapshot>,
  openRefusal?: ErrorCode,
  adjustRefusal?: ErrorCode,
): PresenceComposition {
  return {
    controller: new PresenceController(
      { execute: list },
      {
        execute: async () => {
          if (openRefusal !== undefined) {
            throw new Error(openRefusal);
          }
          return camille;
        },
      },
      {
        execute: async () => {
          if (adjustRefusal !== undefined) {
            throw new Error(adjustRefusal);
          }
          return camille;
        },
      },
    ),
    presenter: new PresencePresenter(),
    errorPresenter: new ErrorPresenter(),
  };
}

function renderPage(deps: PresenceComposition) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={client}>
      <PresencesPage deps={deps} />
    </QueryClientProvider>,
  );
}

async function openMonthThroughDialog() {
  fireEvent.click(
    await screen.findByRole('button', {
      name: i18n.messages.presences.openMonth,
    }),
  );

  const dialog = within(screen.getByRole('dialog'));
  fireEvent.keyDown(
    dialog.getByRole('combobox', { name: i18n.messages.presences.employee }),
    { key: 'Enter' },
  );
  fireEvent.click(screen.getByRole('option', { name: 'Camille Martin' }));
  fireEvent.change(dialog.getByLabelText(i18n.messages.presences.month), {
    target: { value: '2026-10' },
  });
  fireEvent.click(
    dialog.getByRole('button', { name: i18n.messages.presences.open }),
  );
}

async function adjustDaysThroughDialog() {
  fireEvent.click(
    await screen.findByRole('button', { name: i18n.messages.presences.adjust }),
  );

  const dialog = within(screen.getByRole('dialog'));
  fireEvent.change(dialog.getByLabelText(i18n.messages.presences.workedDays), {
    target: { value: '20' },
  });
  fireEvent.click(
    dialog.getByRole('button', { name: i18n.messages.presences.save }),
  );
}

describe('PresencesPage', () => {
  it('closes the dialog once the days are corrected', async () => {
    renderPage(compositionOf(async () => listWith([camille])));

    await adjustDaysThroughDialog();

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('explains inside the dialog why the days could not be corrected', async () => {
    renderPage(
      compositionOf(
        async () => listWith([camille]),
        undefined,
        ErrorCode.ACCESS_DENIED,
      ),
    );

    await adjustDaysThroughDialog();

    expect(
      (await within(screen.getByRole('dialog')).findByRole('alert')).textContent,
    ).toBe(i18n.messages.errors.ACCESS_DENIED);
  });

  it('shows the history of a month that was corrected', async () => {
    renderPage(
      compositionOf(async () =>
        listWith([
          {
            ...camille,
            workedDays: 20,
            adjustments: [
              {
                actorId: 'user-1',
                occurredAt: '2026-10-13T09:00:00.000Z',
                before: 22,
                after: 20,
              },
            ],
          },
        ]),
      ),
    );

    expect(await screen.findByText('13/10/2026 : 22 → 20')).toBeTruthy();
    expect(
      screen.getByText(`${i18n.messages.presences.originalValue} : 22`),
    ).toBeTruthy();
  });

  it('shows a waiting state while the presences load', () => {
    renderPage(compositionOf(() => new Promise(() => undefined)));

    expect(screen.getByText(i18n.messages.loading)).toBeTruthy();
  });

  it('lists the months that were opened', async () => {
    renderPage(compositionOf(async () => listWith([camille])));

    expect(await screen.findByText('Octobre 2026')).toBeTruthy();
    expect(screen.getAllByText('Camille Martin').length).toBeGreaterThan(0);
  });

  it('asks again for the months with the filters the employer chose', async () => {
    const asked: unknown[] = [];
    const deps = compositionOf(async () => listWith([camille]));
    const controller = new PresenceController(
      {
        execute: async (filter) => {
          asked.push(filter);
          return listWith([camille]);
        },
      },
      { execute: async () => camille },
      { execute: async () => camille },
    );
    renderPage({ ...deps, controller });

    fireEvent.change(await screen.findByLabelText(i18n.messages.presences.fromMonth), {
      target: { value: '2026-09' },
    });
    fireEvent.change(screen.getByLabelText(i18n.messages.presences.toMonth), {
      target: { value: '2026-10' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: i18n.messages.presences.filter }),
    );

    await waitFor(() =>
      expect(asked).toEqual([{}, { from: '2026-09', to: '2026-10' }]),
    );
  });

  it('keeps the filters on screen while the filtered months load', async () => {
    const deps = compositionOf(async () => listWith([camille]));
    let calls = 0;
    const controller = new PresenceController(
      {
        execute: async () => {
          calls += 1;
          if (calls > 1) {
            return new Promise<PresenceListSnapshot>(() => undefined);
          }
          return listWith([camille]);
        },
      },
      { execute: async () => camille },
      { execute: async () => camille },
    );
    renderPage({ ...deps, controller });
    const from = await screen.findByLabelText<HTMLInputElement>(
      i18n.messages.presences.fromMonth,
    );

    fireEvent.change(from, { target: { value: '2026-09' } });
    fireEvent.click(
      screen.getByRole('button', { name: i18n.messages.presences.filter }),
    );

    await waitFor(() => expect(calls).toBe(2));
    expect(
      screen.getByLabelText<HTMLInputElement>(i18n.messages.presences.fromMonth)
        .value,
    ).toBe('2026-09');
  });

  it('shows the leaves, the sick leaves and the overtime of each month', async () => {
    renderPage(
      compositionOf(async () =>
        listWith([
          {
            ...camille,
            leaves: [
              {
                id: 'a1',
                type: 'Congés payés',
                start: '2026-10-05',
                end: '2026-10-07',
                days: 3,
              },
            ],
            sickLeaves: [{ id: 's1', date: '2026-10-14' }],
            overtime: [{ id: 'h1', date: '2026-10-12', hours: 2 }],
          },
        ]),
      ),
    );

    expect(
      await screen.findByText('Congés payés : 05/10/2026 → 07/10/2026 (3 j)'),
    ).toBeTruthy();
    expect(screen.getByText('14/10/2026')).toBeTruthy();
    expect(screen.getByText('12/10/2026 : 2 h')).toBeTruthy();
  });

  it('announces the empty state when no month matches', async () => {
    renderPage(compositionOf(async () => listWith([])));

    expect(
      await screen.findByText(i18n.messages.presences.noPresence),
    ).toBeTruthy();
  });

  it('offers no action to an employee when no month matches', async () => {
    renderPage(compositionOf(async () => listWith([], false)));

    expect(
      await screen.findByText(i18n.messages.presences.noPresence),
    ).toBeTruthy();
    expect(screen.queryAllByRole('button')).toEqual([]);
  });

  it('shows a readable message when the presences cannot be loaded', async () => {
    renderPage(
      compositionOf(async () => {
        throw new Error(ErrorCode.ACCESS_DENIED);
      }),
    );

    expect(
      await screen.findByText(i18n.messages.errors.ACCESS_DENIED),
    ).toBeTruthy();
  });

  it('explains inside the dialog why the month could not be opened', async () => {
    renderPage(
      compositionOf(
        async () => listWith([camille]),
        ErrorCode.POTENTIAL_DUPLICATE,
      ),
    );

    await openMonthThroughDialog();

    expect(
      (await within(screen.getByRole('dialog')).findByRole('alert')).textContent,
    ).toBe(i18n.messages.errors.POTENTIAL_DUPLICATE);
  });

  it('closes the dialog once the month is open', async () => {
    renderPage(compositionOf(async () => listWith([camille])));

    await openMonthThroughDialog();

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });
});
