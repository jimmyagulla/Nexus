import { FetchHttpClient } from '@hexagonal-monorepo-template/infrastructure';
import { createCompanySettingsComposition } from './composition/company-settings.composition';

const httpClient = new FetchHttpClient('http://localhost:3000/api');

export const companySettingsComposition =
  createCompanySettingsComposition(httpClient);
export const companySettingsController = companySettingsComposition.controller;
export const companySettingsPresenter = companySettingsComposition.presenter;
export const auditEventPresenter = companySettingsComposition.auditPresenter;
