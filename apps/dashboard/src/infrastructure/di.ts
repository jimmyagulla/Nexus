import { createCompanySettingsComposition } from './composition/company-settings.composition';
import type { CompanySettingsComposition } from './composition/company-settings.composition';
import { createHttpClient } from './network/create-http-client';
import { createSessionGateway } from './session/create-session-gateway';

let companySettingsComposition: CompanySettingsComposition | undefined;

export function getCompanySettingsComposition(): CompanySettingsComposition {
  companySettingsComposition ??= createCompanySettingsComposition(
    createHttpClient(),
    createSessionGateway(),
  );
  return companySettingsComposition;
}
