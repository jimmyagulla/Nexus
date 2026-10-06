import { FetchHttpClient } from '@hexagonal-monorepo-template/adapters';
import { IHttpClient } from '@hexagonal-monorepo-template/ports';
import { loadDashboardConfig } from '../config/load-dashboard-config';

export function createHttpClient(): IHttpClient {
  return new FetchHttpClient(loadDashboardConfig().apiUrl);
}
