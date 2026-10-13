import { render, screen } from '@testing-library/react';
import { PresenceList } from './PresenceList';

describe('PresenceList', () => {
  it('renders one card per month', () => {
    render(
      <PresenceList
        presences={[
          {
            id: 'p1',
            employeeName: 'Camille Martin',
            monthLabel: 'Octobre 2026',
            workedDays: 22,
          },
          {
            id: 'p2',
            employeeName: 'Dominique Durand',
            monthLabel: 'Octobre 2026',
            workedDays: 20,
          },
        ]}
      />,
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('Dominique Durand')).toBeTruthy();
  });
});
