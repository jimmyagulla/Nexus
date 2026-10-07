import { z } from 'zod';
import { ErrorCode } from '@hexagonal-monorepo-template/domain';

export const companyNameSchema = z.object({
  name: z.string().trim().min(1, ErrorCode.REQUIRED_INFORMATION),
});

export type CompanyNameValues = z.infer<typeof companyNameSchema>;
