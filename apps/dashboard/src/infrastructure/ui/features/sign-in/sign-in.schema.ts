import { z } from 'zod';
import { ErrorCode } from '@hexagonal-monorepo-template/domain';

export const signInSchema = z.object({
  identifier: z.string().trim().min(1, ErrorCode.REQUIRED_INFORMATION),
  secret: z.string().trim().min(1, ErrorCode.REQUIRED_INFORMATION),
});

export type SignInValues = z.infer<typeof signInSchema>;
