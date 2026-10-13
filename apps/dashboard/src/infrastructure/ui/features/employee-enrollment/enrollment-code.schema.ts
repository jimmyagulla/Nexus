import { z } from 'zod';
import {
  ErrorCode,
  SECOND_FACTOR_CODE_PATTERN,
} from '@hexagonal-monorepo-template/domain';

export const enrollmentCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, ErrorCode.REQUIRED_INFORMATION)
    .regex(SECOND_FACTOR_CODE_PATTERN, ErrorCode.REQUIRED_INFORMATION),
});

export type EnrollmentCodeValues = z.infer<typeof enrollmentCodeSchema>;
