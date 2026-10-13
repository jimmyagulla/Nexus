export const HoursFactStatus = {
  VALIDATED: 'VALIDATED',
  PROCESSED: 'PROCESSED',
} as const;

export type HoursFactStatus =
  (typeof HoursFactStatus)[keyof typeof HoursFactStatus];
