import { z } from 'zod';
import { ErrorCode } from '@hexagonal-monorepo-template/domain';

export const inviteEmployerSchema = z.object({
  identifier: z.string().trim().min(1, ErrorCode.REQUIRED_INFORMATION),
});

export type InviteEmployerValues = z.infer<typeof inviteEmployerSchema>;
