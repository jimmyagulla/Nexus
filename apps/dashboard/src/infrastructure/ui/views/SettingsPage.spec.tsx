import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SettingsPage } from './SettingsPage';

vi.mock('../../../adapters/gateways/company-api.gateway', () => ({
  fetchCompanySettings: vi.fn(),
  createCompany: vi.fn(),
  updateCompanyName: vi.fn(),
  updateNonWorkingWeekdays: vi.fn(),
  addHoliday: vi.fn(),
  removeHoliday: vi.fn(),
}));

vi.mock('../stores/company-session.store', () => ({
  getCompanyId: () => null,
  setCompanyId: vi.fn(),
}));

describe('SettingsPage', () => {
  it('shows company creation when no session exists', async () => {
    render(<SettingsPage />);
    expect(await screen.findByText('Paramètres')).toBeTruthy();
    expect(screen.getByText("Créer l'entreprise")).toBeTruthy();
  });
});
