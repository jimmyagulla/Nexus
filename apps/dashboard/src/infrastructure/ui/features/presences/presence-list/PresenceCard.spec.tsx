import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import type { PresenceRowViewModel } from '../../../../../adapters/presenters/presence.presenter';
import { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import { i18n } from '../../../i18n/i18n';
import { PresenceCard } from './PresenceCard';

const row: PresenceRowViewModel = {
  id: 'p1',
  employeeName: 'Camille Martin',
  monthLabel: 'Octobre 2026',
  workedDays: 22,
  originalWorkedDays: 22,
  history: [],
  leaves: ['Congés payés : 05/10/2026 → 07/10/2026 (3 j)'],
  absences: [],
  sickLeaves: ['14/10/2026'],
  overtime: ['15/10/2026 : 2 h'],
};

function renderCard(
  presence: PresenceRowViewModel = row,
  options: { canManage?: boolean; adjustError?: string | null } = {},
) {
  const adjusted: { presenceId: string; workedDays: number }[] = [];

  render(
    <ul>
      <PresenceCard
        presence={presence}
        canManage={options.canManage ?? true}
        errorPresenter={new ErrorPresenter()}
        adjustError={options.adjustError ?? null}
        onAdjust={async (presenceId, values) => {
          adjusted.push({ presenceId, workedDays: values.workedDays });
          return true;
        }}
      />
    </ul>,
  );

  return { adjusted };
}

describe('PresenceCard', () => {
  it('names the employee and the month', () => {
    renderCard();

    expect(screen.getByText('Camille Martin')).toBeTruthy();
    expect(screen.getByText('Octobre 2026')).toBeTruthy();
  });

  it('shows the worked days with their label', () => {
    renderCard();

    expect(
      screen.getByText(`${i18n.messages.presences.workedDays} : 22`),
    ).toBeTruthy();
  });

  it('shows the four rubrics of the month', () => {
    renderCard();

    for (const label of [
      i18n.messages.presences.leaves,
      i18n.messages.presences.absences,
      i18n.messages.presences.sickLeaves,
      i18n.messages.presences.overtime,
    ]) {
      expect(screen.getByRole('heading', { name: label })).toBeTruthy();
    }
  });

  it('writes the entries of each rubric', () => {
    renderCard();

    expect(
      screen.getByText('Congés payés : 05/10/2026 → 07/10/2026 (3 j)'),
    ).toBeTruthy();
    expect(screen.getByText('14/10/2026')).toBeTruthy();
    expect(screen.getByText('15/10/2026 : 2 h')).toBeTruthy();
  });

  it('leaves a rubric without fact empty', () => {
    renderCard({
      ...row,
      leaves: [],
      absences: [],
      sickLeaves: [],
      overtime: [],
    });

    expect(screen.getAllByText(i18n.messages.presences.empty)).toHaveLength(4);
  });

  it('shows the history of a month that was corrected', () => {
    renderCard({
      ...row,
      workedDays: 20,
      history: ['13/10/2026 : 22 → 20'],
    });

    expect(
      screen.getByText(`${i18n.messages.presences.originalValue} : 22`),
    ).toBeTruthy();
    expect(screen.getByText('13/10/2026 : 22 → 20')).toBeTruthy();
  });

  it('shows no history for a month nobody corrected', () => {
    renderCard();

    expect(
      screen.queryByRole('heading', { name: i18n.messages.presences.history }),
    ).toBeNull();
  });

  it('lets an actor who manages the months adjust the days', () => {
    renderCard();

    expect(
      screen.getByRole('button', { name: i18n.messages.presences.adjust }),
    ).toBeTruthy();
  });

  it('does not let an actor who cannot manage adjust the days', () => {
    renderCard(row, { canManage: false });

    expect(
      screen.queryByRole('button', { name: i18n.messages.presences.adjust }),
    ).toBeNull();
  });

  it('hands the presence and the corrected days to its caller', async () => {
    const { adjusted } = renderCard();

    fireEvent.click(
      screen.getByRole('button', { name: i18n.messages.presences.adjust }),
    );
    const dialog = within(screen.getByRole('dialog'));
    fireEvent.change(dialog.getByLabelText(i18n.messages.presences.workedDays), {
      target: { value: '20' },
    });
    fireEvent.click(
      dialog.getByRole('button', { name: i18n.messages.presences.save }),
    );

    await waitFor(() =>
      expect(adjusted).toEqual([{ presenceId: 'p1', workedDays: 20 }]),
    );
  });
});
