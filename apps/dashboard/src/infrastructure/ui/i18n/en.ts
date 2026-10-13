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
  secondFactor: {
    enrollment: {
      title: 'Additional verification',
      instructions:
        'Add this key to your authenticator application, then enter the code it shows.',
      secret: 'Setup key',
      code: 'Verification code',
      confirm: 'Confirm',
      done: 'The additional verification is in place.',
      recoveryTitle: 'Recovery codes',
      recoveryNotice:
        'Keep these codes somewhere safe. Each one works once, in place of the usual code, and they will not be shown again.',
    },
  },
  secondFactorVerification: {
    title: 'Additional verification',
    instructions:
      'Enter the code of your authenticator application, or a recovery code.',
    code: 'Verification or recovery code',
    confirm: 'Verify',
    done: 'The additional verification is done.',
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
    [ErrorCode.SECOND_FACTOR_REQUIRED]:
      'The additional verification is required to access your space.',
  },
} as const;
