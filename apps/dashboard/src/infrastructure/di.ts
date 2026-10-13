import { FetchHttpClient } from '@hexagonal-monorepo-template/adapters';
import { loadDashboardConfig } from './config/load-dashboard-config';
import { createAccountComposition } from './composition/account.composition';
import { createCompanyAccountsComposition } from './composition/company-accounts.composition';
import { createCompanySettingsComposition } from './composition/company-settings.composition';
import { createSessionGateway } from './session/create-session-gateway';

const API_URL = loadDashboardConfig().apiUrl;
const httpClient = new FetchHttpClient(API_URL);
const sessionGateway = createSessionGateway();

export const accountComposition = createAccountComposition(httpClient);

export const companyAccountsComposition = createCompanyAccountsComposition(
  httpClient,
  sessionGateway,
);

export const companySettingsComposition = createCompanySettingsComposition(
  httpClient,
  sessionGateway,
);
export const companySettingsController = companySettingsComposition.controller;
export const companySettingsPresenter = companySettingsComposition.presenter;
export const companySettingsErrorPresenter =
  companySettingsComposition.errorPresenter;
