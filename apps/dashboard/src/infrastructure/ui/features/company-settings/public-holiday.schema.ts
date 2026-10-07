import { z } from 'zod';
import {
  CALENDAR_DATE_PATTERN,
  ErrorCode,
} from '@hexagonal-monorepo-template/domain';

export const publicHolidaySchema = z.object({
  date: z
    .string()
    .regex(CALENDAR_DATE_PATTERN, ErrorCode.REQUIRED_INFORMATION),
  label: z.string().trim().min(1, ErrorCode.REQUIRED_INFORMATION),
});

export type PublicHolidayValues = z.infer<typeof publicHolidaySchema>;
