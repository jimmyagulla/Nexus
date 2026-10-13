export const API_ROUTES = {
  accounts: {
    base: 'accounts',
    activation: 'activation',
    employeeActivation: 'employee-activation',
    signIn: 'sign-in',
  },
  secondFactor: {
    base: 'second-factor',
    enrollmentConfirmation: 'enrollment-confirmation',
  },
  employees: {
    base: 'companies/:companyId/employees',
    invitation: ':employeeId/invitation',
  },
  companies: {
    base: 'companies',
    settings: ':companyId/settings',
    name: ':companyId/name',
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
