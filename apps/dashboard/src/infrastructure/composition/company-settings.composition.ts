import { FetchHttpClient } from '@hexagonal-monorepo-template/adapters';
import { LoadCompanySettingsUseCase } from '../../application/load-company-settings.use-case';
import {
  AddCompanyPublicHolidayFromClientUseCase,
  RemoveCompanyPublicHolidayFromClientUseCase,
  RenameCompanyFromClientUseCase,
  SetNonWorkingWeekdaysFromClientUseCase,
} from '../../application/company-settings.use-cases';
import { CompanySettingsController } from '../../adapters/controllers/company-settings.controller';
import { ApiCompanySettingsGateway } from '../../adapters/gateways/api-company-settings.gateway';
import { SupabaseSessionGateway } from '../../adapters/gateways/supabase-session.gateway';

export function composeCompanySettings(): CompanySettingsController {
  const sessions = SupabaseSessionGateway.fromEnv();
  const companies = new ApiCompanySettingsGateway(
    new FetchHttpClient(import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'),
  );
  return new CompanySettingsController(
    new LoadCompanySettingsUseCase(sessions, companies),
    new RenameCompanyFromClientUseCase(sessions, companies),
    new SetNonWorkingWeekdaysFromClientUseCase(sessions, companies),
    new AddCompanyPublicHolidayFromClientUseCase(sessions, companies),
    new RemoveCompanyPublicHolidayFromClientUseCase(sessions, companies),
  );
}
