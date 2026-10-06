import { z } from 'zod';
import { ErrorCode } from '@hexagonal-monorepo-template/domain';

export const publicHolidaySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, ErrorCode.REQUIRED_INFORMATION),
  label: z.string().trim().min(1, ErrorCode.REQUIRED_INFORMATION),
});

export type PublicHolidayValues = z.infer<typeof publicHolidaySchema>;
