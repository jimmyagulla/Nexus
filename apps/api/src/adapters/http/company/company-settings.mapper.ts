import {
  Company,
  CompanySettingsSnapshot,
  toCompanySettingsSnapshot,
} from '@hexagonal-monorepo-template/domain';
import { CompanySettingsResponseDto } from './dto/company-settings-response.dto';

export function toCompanySettingsResponse(
  source: Company | CompanySettingsSnapshot,
): CompanySettingsResponseDto {
  const snapshot =
    source instanceof Company ? toCompanySettingsSnapshot(source) : source;
  return {
    id: snapshot.id,
    name: snapshot.name,
    nonWorkingWeekdays: [...snapshot.nonWorkingWeekdays],
    publicHolidays: snapshot.publicHolidays.map((holiday) => ({ ...holiday })),
  };
}
