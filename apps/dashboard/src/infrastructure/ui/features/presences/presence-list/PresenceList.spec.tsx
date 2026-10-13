import { render, screen } from '@testing-library/react';
import type { PresenceRowViewModel } from '../../../../../adapters/presenters/presence.presenter';
import { PresenceList } from './PresenceList';

function row(id: string, employeeName: string): PresenceRowViewModel {
  return {
    id,
    employeeName,
    monthLabel: 'Octobre 2026',
    workedDays: 22,
    leaves: [],
    absences: [],
    sickLeaves: [],
    overtime: [],
  };
}

describe('PresenceList', () => {
  it('renders one card per month', () => {
    render(
      <PresenceList
        presences={[
          row('p1', 'Camille Martin'),
          row('p2', 'Dominique Durand'),
        ]}
      />,
    );

    expect(screen.getByText('Camille Martin')).toBeTruthy();
    expect(screen.getByText('Dominique Durand')).toBeTruthy();
  });
});
