import { z } from 'zod';
import { ErrorCode } from '@hexagonal-monorepo-template/domain';

export const createExpenseReportSchema = z.object({
  label: z.string().trim().min(1, ErrorCode.REQUIRED_INFORMATION),
});

export type CreateExpenseReportValues = z.infer<
  typeof createExpenseReportSchema
>;
