import { z } from 'zod';
import { DayOfWeek } from '@hexagonal-monorepo-template/domain';

export const nonWorkingWeekdaysSchema = z.object({
  weekdays: z.array(z.enum(DayOfWeek)),
});

export type NonWorkingWeekdaysValues = z.infer<typeof nonWorkingWeekdaysSchema>;
