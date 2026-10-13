import { render, screen, within } from '@testing-library/react';
import { i18n } from '../../../i18n/i18n';
import { WorkedDaysHistory } from './WorkedDaysHistory';

describe('WorkedDaysHistory', () => {
  it('shows nothing for a month nobody corrected', () => {
    const { container } = render(
      <WorkedDaysHistory originalWorkedDays={22} history={[]} />,
    );

    expect(container.textContent).toBe('');
  });

  it('shows the value the month was opened with', () => {
    render(
      <WorkedDaysHistory
        originalWorkedDays={22}
        history={['13/10/2026 : 22 → 20']}
      />,
    );

    expect(
      screen.getByText(`${i18n.messages.presences.originalValue} : 22`),
    ).toBeTruthy();
  });

  it('shows the old and the new value of each correction', () => {
    render(
      <WorkedDaysHistory
        originalWorkedDays={22}
        history={['13/10/2026 : 22 → 20', '14/10/2026 : 20 → 21']}
      />,
    );

    const lines = within(screen.getByRole('list')).getAllByRole('listitem');

    expect(lines.map((line) => line.textContent)).toEqual([
      '13/10/2026 : 22 → 20',
      '14/10/2026 : 20 → 21',
    ]);
  });

  it('titles the history', () => {
    render(
      <WorkedDaysHistory
        originalWorkedDays={22}
        history={['13/10/2026 : 22 → 20']}
      />,
    );

    expect(
      screen.getByRole('heading', { name: i18n.messages.presences.history }),
    ).toBeTruthy();
  });
});
