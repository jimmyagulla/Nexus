import { FetchHttpClient } from '@hexagonal-monorepo-template/adapters';
import { loadDashboardConfig } from './config/load-dashboard-config';
import { createCompanySettingsComposition } from './composition/company-settings.composition';
import { createSessionGateway } from './session/create-session-gateway';

const API_URL = loadDashboardConfig().apiUrl;
const httpClient = new FetchHttpClient(API_URL);

export const companySettingsComposition = createCompanySettingsComposition(
  httpClient,
  createSessionGateway(),
);
export const companySettingsController = companySettingsComposition.controller;
export const companySettingsPresenter = companySettingsComposition.presenter;
export const companySettingsErrorPresenter =
  companySettingsComposition.errorPresenter;
