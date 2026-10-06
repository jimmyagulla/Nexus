export const DayOfWeek = {
  SUNDAY: 'SUNDAY',
  MONDAY: 'MONDAY',
  TUESDAY: 'TUESDAY',
  WEDNESDAY: 'WEDNESDAY',
  THURSDAY: 'THURSDAY',
  FRIDAY: 'FRIDAY',
  SATURDAY: 'SATURDAY',
} as const;

export type DayOfWeek = (typeof DayOfWeek)[keyof typeof DayOfWeek];

const VALUES = new Set<string>(Object.values(DayOfWeek));

export function isDayOfWeek(value: string): value is DayOfWeek {
  return VALUES.has(value);
}
