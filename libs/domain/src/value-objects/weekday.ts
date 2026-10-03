export const Weekday = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
} as const;

export type Weekday = (typeof Weekday)[keyof typeof Weekday];

export const DEFAULT_NON_WORKING_WEEKDAYS: Weekday[] = [
  Weekday.SATURDAY,
  Weekday.SUNDAY,
];

export function isWeekday(value: number): value is Weekday {
  return Number.isInteger(value) && value >= 0 && value <= 6;
}
