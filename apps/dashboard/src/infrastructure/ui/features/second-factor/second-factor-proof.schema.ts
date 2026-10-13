import { z } from 'zod';
import {
  ErrorCode,
  RECOVERY_CODE_PATTERN,
  SECOND_FACTOR_CODE_PATTERN,
} from '@hexagonal-monorepo-template/domain';

function isProof(raw: string): boolean {
  const code = raw.replace(/[\s-]+/g, '').toUpperCase();
  return (
    SECOND_FACTOR_CODE_PATTERN.test(code) || RECOVERY_CODE_PATTERN.test(code)
  );
}

export const secondFactorProofSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, ErrorCode.REQUIRED_INFORMATION)
    .refine(isProof, ErrorCode.SECOND_FACTOR_REQUIRED),
});
