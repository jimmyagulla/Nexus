import { FetchHttpClient } from '@hexagonal-monorepo-template/adapters';
import { loadDashboardConfig } from './config/load-dashboard-config';
import { createCabinetExchangeComposition } from './composition/cabinet-exchange.composition';
import { createCompanySettingsComposition } from './composition/company-settings.composition';
import { createNavigationComposition } from './composition/navigation.composition';
import { createSessionGateway } from './session/create-session-gateway';

const API_URL = loadDashboardConfig().apiUrl;
const httpClient = new FetchHttpClient(API_URL);
const sessions = createSessionGateway();

export const companySettingsComposition = createCompanySettingsComposition(
  httpClient,
  sessions,
);
export const companySettingsController = companySettingsComposition.controller;
export const companySettingsPresenter = companySettingsComposition.presenter;
export const companySettingsErrorPresenter =
  companySettingsComposition.errorPresenter;

export const navigationComposition = createNavigationComposition(sessions);

export const cabinetExchangeComposition = createCabinetExchangeComposition(
  httpClient,
  sessions,
);
