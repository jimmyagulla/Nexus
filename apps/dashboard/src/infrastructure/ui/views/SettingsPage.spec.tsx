import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DayOfWeek } from '@hexagonal-monorepo-template/domain';
import { SettingsPage } from './SettingsPage';
import { fr } from '../i18n/fr';

describe('SettingsPage', () => {
  it('shows the company name and calendar', async () => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    render(
      <QueryClientProvider client={client}>
        <SettingsPage
          controller={{
            getSettings: async () => ({
              id: 'c1',
              name: 'Acme',
              nonWorkingWeekdays: [DayOfWeek.SATURDAY, DayOfWeek.SUNDAY],
              publicHolidays: [],
            }),
            renameCompany: async () => {
              throw new Error('unused');
            },
            updateNonWorkingWeekdays: async () => {
              throw new Error('unused');
            },
            addPublicHoliday: async () => {
              throw new Error('unused');
            },
            removePublicHoliday: async () => {
              throw new Error('unused');
            },
          }}
        />
      </QueryClientProvider>,
    );

    expect(await screen.findByDisplayValue('Acme')).toBeTruthy();
    expect(
      screen.getByRole('heading', { name: fr.settings.title }),
    ).toBeTruthy();
  });
});
