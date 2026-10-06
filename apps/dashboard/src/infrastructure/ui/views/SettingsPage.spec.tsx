import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AuditEventPresenter } from '../../../adapters/presenters/audit-event/audit-event.presenter';
import { CompanySettingsPresenter } from '../../../adapters/presenters/company-settings/company-settings.presenter';
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
};

describe('SettingsPage', () => {
  it('shows company creation when no session exists', async () => {
    const client = new QueryClient();
    render(
      <QueryClientProvider client={client}>
        <SettingsPage
          controller={controller}
          presenter={new CompanySettingsPresenter()}
          auditPresenter={new AuditEventPresenter()}
        />
      </QueryClientProvider>,
    );
    expect(await screen.findByText('Paramètres')).toBeTruthy();
    expect(screen.getByText("Créer l'entreprise")).toBeTruthy();
  });
});
