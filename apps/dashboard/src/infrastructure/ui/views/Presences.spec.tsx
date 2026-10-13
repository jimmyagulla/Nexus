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

    expect(screen.getByText('Camille Martin')).toBeTruthy();
    expect(screen.getByText('Octobre 2026')).toBeTruthy();
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
