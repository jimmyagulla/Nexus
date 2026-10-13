import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import type { PresenceRowViewModel } from '../../../../../adapters/presenters/presence.presenter';
import { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import { i18n } from '../../../i18n/i18n';
import { PresenceList } from './PresenceList';

function row(id: string, employeeName: string): PresenceRowViewModel {
  return {
    id,
    employeeName,
    monthLabel: 'Octobre 2026',
    workedDays: 22,
    originalWorkedDays: 22,
    history: [],
    leaves: [],
    absences: [],
    sickLeaves: [],
    overtime: [],
  };
}

function renderList(
  canManage = true,
  presences: PresenceRowViewModel[] = [
    row('p1', 'Camille Martin'),
    row('p2', 'Dominique Durand'),
  ],
) {
  const adjusted: { presenceId: string; workedDays: number }[] = [];

  render(
    <PresenceList
      presences={presences}
      canManage={canManage}
      errorPresenter={new ErrorPresenter()}
      adjustError={null}
      onAdjust={async (presenceId, values) => {
        adjusted.push({ presenceId, workedDays: values.workedDays });
        return true;
      }}
    />,
  );

  return { adjusted };
}

describe('PresenceList', () => {
  it('renders one card per month', () => {
    renderList();

    expect(screen.getByText('Camille Martin')).toBeTruthy();
    expect(screen.getByText('Dominique Durand')).toBeTruthy();
  });

  it('announces that no month matches', () => {
    renderList(true, []);

    expect(screen.getByText(i18n.messages.presences.noPresence)).toBeTruthy();
  });

  it('announces the empty list the same way to an actor who cannot manage', () => {
    renderList(false, []);

    expect(screen.getByText(i18n.messages.presences.noPresence)).toBeTruthy();
  });

  it('announces nothing when a month matches', () => {
    renderList();

    expect(screen.queryByText(i18n.messages.presences.noPresence)).toBeNull();
  });

  it('lets the actor who manages adjust each month', () => {
    renderList();

    expect(
      screen.getAllByRole('button', { name: i18n.messages.presences.adjust }),
    ).toHaveLength(2);
  });

  it('does not let an actor who cannot manage adjust a month', () => {
    renderList(false);

    expect(
      screen.queryByRole('button', { name: i18n.messages.presences.adjust }),
    ).toBeNull();
  });

  it('hands back the month that was corrected', async () => {
    const { adjusted } = renderList();

    fireEvent.click(
      screen.getAllByRole('button', { name: i18n.messages.presences.adjust })[1] as HTMLElement,
    );
    const dialog = within(screen.getByRole('dialog'));
    fireEvent.change(dialog.getByLabelText(i18n.messages.presences.workedDays), {
      target: { value: '18' },
    });
    fireEvent.click(
      dialog.getByRole('button', { name: i18n.messages.presences.save }),
    );

    await waitFor(() =>
      expect(adjusted).toEqual([{ presenceId: 'p2', workedDays: 18 }]),
    );
  });
});
