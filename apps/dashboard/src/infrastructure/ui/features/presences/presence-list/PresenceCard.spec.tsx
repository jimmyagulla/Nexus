import { render, screen } from '@testing-library/react';
import { i18n } from '../../../i18n/i18n';
import { PresenceCard } from './PresenceCard';

function renderCard() {
  render(
    <ul>
      <PresenceCard
        presence={{
          id: 'p1',
          employeeName: 'Camille Martin',
          monthLabel: 'Octobre 2026',
          workedDays: 22,
        }}
      />
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

    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });
});
