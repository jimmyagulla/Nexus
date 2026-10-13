import { render, screen } from '@testing-library/react';
import type { PresenceRowViewModel } from '../../../../../adapters/presenters/presence.presenter';
import { i18n } from '../../../i18n/i18n';
import { PresenceCard } from './PresenceCard';

const row: PresenceRowViewModel = {
  id: 'p1',
  employeeName: 'Camille Martin',
  monthLabel: 'Octobre 2026',
  workedDays: 22,
  leaves: ['Congés payés : 05/10/2026 → 07/10/2026 (3 j)'],
  absences: [],
  sickLeaves: ['14/10/2026'],
  overtime: ['15/10/2026 : 2 h'],
};

function renderCard(presence: PresenceRowViewModel = row) {
  render(
    <ul>
      <PresenceCard presence={presence} />
    </ul>,
  );
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

  it('stands as one item of the surrounding list', () => {
    renderCard();

    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0);
    expect(screen.getAllByRole('list')[0]?.tagName).toBe('UL');
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
});
