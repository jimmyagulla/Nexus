export const API_ROUTES = {
  companies: {
    base: 'companies',
    settings: ':companyId/settings',
    name: ':companyId/name',
    nonWorkingWeekdays: ':companyId/calendar/non-working-weekdays',
    publicHolidays: ':companyId/calendar/public-holidays',
    publicHoliday: ':companyId/calendar/public-holidays/:publicHolidayId',
    presences: ':companyId/presences',
    presence: ':companyId/presences/:presenceId',
    presenceWorkedDays: ':companyId/presences/:presenceId/worked-days',
  },
} as const;

export function companyPath(
  template: string,
  params: Record<string, string>,
): string {
  return Object.entries(params).reduce(
    (path, [key, value]) => path.replace(`:${key}`, value),
    `${API_ROUTES.companies.base}/${template}`,
  );
}
