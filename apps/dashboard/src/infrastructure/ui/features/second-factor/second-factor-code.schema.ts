import { z } from 'zod';
import {
  ErrorCode,
  SECOND_FACTOR_CODE_PATTERN,
} from '@hexagonal-monorepo-template/domain';

export const secondFactorCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, ErrorCode.REQUIRED_INFORMATION)
    .refine(
      (code) => SECOND_FACTOR_CODE_PATTERN.test(code.replace(/\s+/g, '')),
      ErrorCode.SECOND_FACTOR_REQUIRED,
    ),
});

export type SecondFactorCodeValues = z.infer<typeof secondFactorCodeSchema>;
