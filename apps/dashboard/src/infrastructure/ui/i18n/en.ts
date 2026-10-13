import { ErrorCode } from '@hexagonal-monorepo-template/domain';

export const en = {
  navigation: {
    dashboard: 'Dashboard',
    accounts: 'Accounts',
    settings: 'Settings',
  },
  accounts: {
    title: 'Accounts',
    identifier: 'Identifier',
    role: 'Role',
    status: 'Status',
    invite: 'Invite',
    disable: 'Disable',
    restore: 'Restore',
    activationLink: 'Activation link to hand over',
    roles: {
      EMPLOYER: 'Employer',
      EMPLOYEE: 'Employee',
      ACCOUNTANT: 'Accounting firm',
    },
    statuses: {
      INVITED: 'Invited',
      ACTIVE: 'Active',
      DISABLED: 'Disabled',
    },
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
  signIn: {
    title: 'Sign in',
    identifier: 'Identifier',
    secret: 'Secret',
    submit: 'Sign in',
  },
  activation: {
    title: 'Activate your access',
    secret: 'Secret',
    submit: 'Activate',
    opened: 'Your workspace is open.',
  },
  errors: {
    [ErrorCode.ACCESS_DENIED]: 'You do not have access to this item.',
    [ErrorCode.REQUIRED_INFORMATION]: 'Fill in the required information.',
    [ErrorCode.POTENTIAL_DUPLICATE]: 'A similar item already exists.',
    [ErrorCode.INVITATION_INVALID]: 'This activation link is no longer usable.',
    [ErrorCode.ACCOUNT_LOCKED]:
      'Sign-in is locked. An employer must restore access.',
  },
} as const;
