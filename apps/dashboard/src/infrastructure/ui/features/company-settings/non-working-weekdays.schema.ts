import { z } from 'zod';
import { DayOfWeek } from '@hexagonal-monorepo-template/domain';

export const nonWorkingWeekdaysSchema = z.object({
  weekdays: z.array(
    z.enum([
      DayOfWeek.SUNDAY,
      DayOfWeek.MONDAY,
      DayOfWeek.TUESDAY,
      DayOfWeek.WEDNESDAY,
      DayOfWeek.THURSDAY,
      DayOfWeek.FRIDAY,
      DayOfWeek.SATURDAY,
    ]),
  ),
});

export type NonWorkingWeekdaysValues = z.infer<typeof nonWorkingWeekdaysSchema>;
