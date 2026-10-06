import * as z from 'zod';

export const WeekdayToken = {
  SUNDAY: '0',
  MONDAY: '1',
  TUESDAY: '2',
  WEDNESDAY: '3',
  THURSDAY: '4',
  FRIDAY: '5',
  SATURDAY: '6',
} as const;

export const weekdayTokenSchema = z.enum(WeekdayToken);

export const nonWorkingWeekdaysSchema = z.object({
  weekdays: z
    .array(weekdayTokenSchema)
    .transform((weekdays) => weekdays.map((weekday) => Number(weekday))),
});

export type NonWorkingWeekdaysValues = z.infer<typeof nonWorkingWeekdaysSchema>;
