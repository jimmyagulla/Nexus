import { Company } from '@hexagonal-monorepo-template/domain';
import { CompanySettingsResponseDto } from './dto/company-settings-response.dto';

export function toCompanySettingsResponse(
  company: Company,
): CompanySettingsResponseDto {
  return {
    id: company.id,
    name: company.name,
    nonWorkingWeekdays: [...company.nonWorkingWeekdays],
    holidays: company.holidays.map((holiday) => ({
      id: holiday.id,
      date: holiday.date,
      label: holiday.label,
    })),
  };
}
