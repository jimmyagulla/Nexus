import { render, screen } from '@testing-library/react';
import type { PresenceListViewModel } from '../../../adapters/presenters/presence.presenter';
import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { i18n } from '../i18n/i18n';
import { Presences } from './Presences';

const model: PresenceListViewModel = {
  rows: [
    {
      id: 'p1',
      employeeName: 'Camille Martin',
      monthLabel: 'Octobre 2026',
      workedDays: 22,
      originalWorkedDays: 22,
      history: [],
      leaves: [],
      absences: [],
      sickLeaves: [],
      overtime: [],
    },
  ],
  employees: [{ value: 'e1', label: 'Camille Martin' }],
  canManage: true,
};

function renderView(overrides: Partial<PresenceListViewModel> = {}) {
  render(
    <Presences
      model={{ ...model, ...overrides }}
      errorPresenter={new ErrorPresenter()}
      openError={null}
      adjustError={null}
      onOpen={async () => true}
      onAdjust={async () => true}
      onFilter={() => undefined}
    />,
  );
}

describe('Presences', () => {
  it('titles the screen', () => {
    renderView();

    expect(
      screen.getByRole('heading', { name: i18n.messages.presences.title }),
    ).toBeTruthy();
  });

  it('titles the screen of an actor who cannot manage as his own months', () => {
    renderView({ canManage: false });

    expect(
      screen.getByRole('heading', { name: i18n.messages.presences.ownTitle }),
    ).toBeTruthy();
    expect(
      screen.queryByRole('heading', { name: i18n.messages.presences.title }),
    ).toBeNull();
  });

  it('lists the months that were opened', () => {
    renderView();

    expect(screen.getAllByText('Camille Martin').length).toBeGreaterThan(0);
    expect(screen.getByText('Octobre 2026')).toBeTruthy();
  });

  it('announces the empty state and still lets the employer open the month', () => {
    renderView({ rows: [] });

    expect(screen.getByText(i18n.messages.presences.noPresence)).toBeTruthy();
    expect(
      screen.getByRole('button', { name: i18n.messages.presences.openMonth }),
    ).toBeTruthy();
  });

  it('announces the empty state to an employee without any action', () => {
    renderView({ rows: [], canManage: false });

    expect(screen.getByText(i18n.messages.presences.noPresence)).toBeTruthy();
    expect(screen.queryAllByRole('button')).toEqual([]);
  });

  it('lets the employer open a month', () => {
    renderView();

    expect(
      screen.getByRole('button', { name: i18n.messages.presences.openMonth }),
    ).toBeTruthy();
  });

  it('lets the employer adjust the days of a month', () => {
    renderView();

    expect(
      screen.getByRole('button', { name: i18n.messages.presences.adjust }),
    ).toBeTruthy();
  });

  it('lets the employer filter by employee and by period', () => {
    renderView();

    expect(
      screen.getByRole('combobox', { name: i18n.messages.presences.employee }),
    ).toBeTruthy();
    expect(screen.getByLabelText(i18n.messages.presences.fromMonth)).toBeTruthy();
    expect(screen.getByLabelText(i18n.messages.presences.toMonth)).toBeTruthy();
  });

  it('does not offer the filters to an actor who cannot manage', () => {
    renderView({ canManage: false });

    expect(
      screen.queryByRole('button', { name: i18n.messages.presences.filter }),
    ).toBeNull();
  });

  it('does not let an actor who cannot manage open a month', () => {
    renderView({ canManage: false });

    expect(
      screen.queryByRole('button', { name: i18n.messages.presences.openMonth }),
    ).toBeNull();
  });

  it('does not let an actor who cannot manage adjust the days', () => {
    renderView({ canManage: false });

    expect(
      screen.queryByRole('button', { name: i18n.messages.presences.adjust }),
    ).toBeNull();
  });
});
