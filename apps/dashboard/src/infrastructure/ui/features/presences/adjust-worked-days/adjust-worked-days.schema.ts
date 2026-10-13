import { z } from 'zod';
import { ErrorCode } from '@hexagonal-monorepo-template/domain';

const MAX_DAYS_IN_A_MONTH = 31;

export const adjustWorkedDaysSchema = z.object({
  workedDays: z
    .number(ErrorCode.REQUIRED_INFORMATION)
    .int(ErrorCode.REQUIRED_INFORMATION)
    .min(0, ErrorCode.REQUIRED_INFORMATION)
    .max(MAX_DAYS_IN_A_MONTH, ErrorCode.REQUIRED_INFORMATION),
});

export type AdjustWorkedDaysValues = z.infer<typeof adjustWorkedDaysSchema>;
