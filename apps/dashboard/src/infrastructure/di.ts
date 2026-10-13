import { FetchHttpClient } from '@hexagonal-monorepo-template/adapters';
import { loadDashboardConfig } from './config/load-dashboard-config';
import { createCompanySettingsComposition } from './composition/company-settings.composition';
import { createExpenseCategoriesComposition } from './composition/expense-categories.composition';
import { createExpenseReportsComposition } from './composition/expense-reports.composition';
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

export const expenseReportsComposition = createExpenseReportsComposition(
  httpClient,
  sessions,
);
export const expenseCategoriesComposition = createExpenseCategoriesComposition(
  httpClient,
  sessions,
);

export const expenseReportsScreenComposition = {
  reports: expenseReportsComposition,
  categories: expenseCategoriesComposition,
};
