import * as z from 'zod';
import { ErrorMessage } from '@hexagonal-monorepo-template/domain';

export const companyNameSchema = z.object({
  name: z.string().trim().min(1, ErrorMessage.INFORMATION_OBLIGATOIRE),
});

export type CompanyNameValues = z.infer<typeof companyNameSchema>;
