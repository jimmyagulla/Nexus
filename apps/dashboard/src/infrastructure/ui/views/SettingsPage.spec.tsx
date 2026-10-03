import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CompanySettingsController } from '../../../adapters/controllers/company-settings/company-settings.controller';
import { SettingsPage } from './SettingsPage';

vi.mock('../stores/company-session.store', () => ({
  getCompanyId: () => null,
  setCompanyId: vi.fn(),
}));

const controller = {
  load: vi.fn(),
  create: vi.fn(),
  rename: vi.fn(),
  setWeekdays: vi.fn(),
  addPublicHoliday: vi.fn(),
  removePublicHoliday: vi.fn(),
} as unknown as CompanySettingsController;

describe('SettingsPage', () => {
  it('shows company creation when no session exists', async () => {
    const client = new QueryClient();
    render(
      <QueryClientProvider client={client}>
        <SettingsPage controller={controller} />
      </QueryClientProvider>,
    );
    expect(await screen.findByText('Paramètres')).toBeTruthy();
    expect(screen.getByText("Créer l'entreprise")).toBeTruthy();
  });
});
