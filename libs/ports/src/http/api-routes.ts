export const API_ROUTES = {
  companies: {
    base: 'companies',
    settings: ':companyId/settings',
    name: ':companyId/name',
    nonWorkingWeekdays: ':companyId/calendar/non-working-weekdays',
    publicHolidays: ':companyId/calendar/public-holidays',
    publicHoliday: ':companyId/calendar/public-holidays/:publicHolidayId',
  },
  cabinetExchanges: {
    base: 'companies/:companyId/cabinet-exchanges',
    toTransmit: ':exchangeId/to-transmit',
    transmission: 'transmission',
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

export function cabinetExchangePath(
  template: string,
  params: Record<string, string>,
): string {
  const base = API_ROUTES.cabinetExchanges.base;
  const path = template === '' ? base : `${base}/${template}`;
  return Object.entries(params).reduce(
    (resolved, [key, value]) => resolved.replace(`:${key}`, value),
    path,
  );
}
