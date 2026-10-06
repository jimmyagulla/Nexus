import { describe, expect, it, vi } from 'vitest';
import { HttpClient } from '@hexagonal-monorepo-template/ports';
import { CompanySettingsController } from '../../adapters/controllers/company-settings/company-settings.controller';
import { AuditEventPresenter } from '../../adapters/presenters/audit-event/audit-event.presenter';
import { CompanySettingsPresenter } from '../../adapters/presenters/company-settings/company-settings.presenter';
import { createCompanySettingsComposition } from './company-settings.composition';

const httpClient: HttpClient = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
};

describe('createCompanySettingsComposition', () => {
  it('returns the controller and its presenters', () => {
    const composition = createCompanySettingsComposition(httpClient);

    expect(composition.controller).toBeInstanceOf(CompanySettingsController);
    expect(composition.presenter).toBeInstanceOf(CompanySettingsPresenter);
    expect(composition.auditPresenter).toBeInstanceOf(AuditEventPresenter);
  });
});
