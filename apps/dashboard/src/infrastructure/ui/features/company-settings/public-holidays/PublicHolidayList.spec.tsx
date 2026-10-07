import { fireEvent, render, screen } from '@testing-library/react';
import { PublicHolidayList } from './PublicHolidayList';
import { i18n } from '../../../i18n/i18n';

describe('PublicHolidayList', () => {
  it('announces an empty list', () => {
    render(
      <PublicHolidayList publicHolidays={[]} onRemove={() => undefined} />,
    );

    expect(screen.getByText(i18n.messages.settings.noPublicHolidays)).toBeTruthy();
  });

  it('renders one card per public holiday', () => {
    render(
      <PublicHolidayList
        publicHolidays={[
          { id: 'ph-1', date: '14/07/2026', label: 'Fête nationale' },
          { id: 'ph-2', date: '11/11/2026', label: 'Armistice' },
        ]}
        onRemove={() => undefined}
      />,
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('hands back the public holiday to remove', () => {
    const removed: string[] = [];
    render(
      <PublicHolidayList
        publicHolidays={[
          { id: 'ph-1', date: '14/07/2026', label: 'Fête nationale' },
        ]}
        onRemove={(id) => removed.push(id)}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', { name: i18n.messages.settings.removeHoliday }),
    );

    expect(removed).toEqual(['ph-1']);
  });
});
