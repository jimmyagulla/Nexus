import { z } from 'zod';
import { ErrorCode } from '@hexagonal-monorepo-template/domain';

export const activationSchema = z.object({
  secret: z.string().trim().min(1, ErrorCode.REQUIRED_INFORMATION),
});

export type ActivationValues = z.infer<typeof activationSchema>;
