import { ErrorCode } from '@hexagonal-monorepo-template/domain';

export const en = {
  navigation: {
    dashboard: 'Dashboard',
    settings: 'Settings',
  },
  loading: 'Loading…',
  home: {
    title: 'Dashboard',
  },
  settings: {
    title: 'Settings',
    name: 'Name',
    saveName: 'Save name',
    nonWorkingWeekdays: 'Usual non-working days',
    saveWeekdays: 'Save days',
    publicHolidays: 'Public holidays',
    addHoliday: 'Add',
    addHolidayTitle: 'Add a public holiday',
    noPublicHolidays: 'No public holiday retained.',
    removeHoliday: 'Remove',
    date: 'Date',
    label: 'Label',
  },
  days: {
    SUNDAY: 'Sunday',
    MONDAY: 'Monday',
    TUESDAY: 'Tuesday',
    WEDNESDAY: 'Wednesday',
    THURSDAY: 'Thursday',
    FRIDAY: 'Friday',
    SATURDAY: 'Saturday',
  },
  errors: {
    [ErrorCode.ACCESS_DENIED]: 'You do not have access to this item.',
    [ErrorCode.REQUIRED_INFORMATION]: 'Fill in the required information.',
    [ErrorCode.POTENTIAL_DUPLICATE]: 'A similar item already exists.',
  },
} as const;
