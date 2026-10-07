import { fireEvent, render, screen } from '@testing-library/react';
import { fr } from '../../i18n/fr';
import { PublicHolidayCard } from './PublicHolidayCard';

function renderCard() {
  const removed: string[] = [];

  render(
    <ul>
      <PublicHolidayCard
        publicHoliday={{
          id: 'ph-1',
          date: '14/07/2026',
          label: 'Fête nationale',
        }}
        onRemove={(id) => removed.push(id)}
      />
    </ul>,
  );

  return { removed };
}

describe('PublicHolidayCard', () => {
  it('shows the date and the label of the public holiday', () => {
    renderCard();

    expect(screen.getByText('14/07/2026 — Fête nationale')).toBeTruthy();
  });

  it('stands as one item of the surrounding list', () => {
    renderCard();

    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });

  it('hands back the public holiday to remove', () => {
    const { removed } = renderCard();

    fireEvent.click(
      screen.getByRole('button', { name: fr.settings.removeHoliday }),
    );

    expect(removed).toEqual(['ph-1']);
  });

  it('removes nothing until the user asks for it', () => {
    const { removed } = renderCard();

    expect(removed).toEqual([]);
  });
});
