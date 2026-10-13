export const API_ROUTES = {
  accounts: {
    base: 'accounts',
    activation: 'activation',
    signIn: 'sign-in',
  },
  companies: {
    base: 'companies',
    settings: ':companyId/settings',
    name: ':companyId/name',
    accounts: ':companyId/accounts',
    nonWorkingWeekdays: ':companyId/calendar/non-working-weekdays',
    publicHolidays: ':companyId/calendar/public-holidays',
    publicHoliday: ':companyId/calendar/public-holidays/:publicHolidayId',
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
