import { render, screen, within } from '@testing-library/react';
import { i18n } from '../../../i18n/i18n';
import { PresenceRubric } from './PresenceRubric';

describe('PresenceRubric', () => {
  it('names the rubric', () => {
    render(<PresenceRubric label="Congés" entries={[]} />);

    expect(screen.getByText('Congés')).toBeTruthy();
  });

  it('writes one line per entry', () => {
    render(
      <PresenceRubric
        label="Congés"
        entries={['Congés payés : 05/10/2026 → 07/10/2026 (3 j)', 'RTT : 12/10/2026 (1 j)']}
      />,
    );

    const lines = within(screen.getByRole('list')).getAllByRole('listitem');

    expect(lines.map((line) => line.textContent)).toEqual([
      'Congés payés : 05/10/2026 → 07/10/2026 (3 j)',
      'RTT : 12/10/2026 (1 j)',
    ]);
  });

  it('shows an empty mark, not an estimate, when the rubric holds nothing', () => {
    render(<PresenceRubric label="Arrêts" entries={[]} />);

    expect(screen.getByText(i18n.messages.presences.empty)).toBeTruthy();
    expect(screen.queryByRole('list')).toBeNull();
  });
});
