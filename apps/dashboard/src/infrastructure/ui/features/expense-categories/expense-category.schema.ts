import { z } from 'zod';
import { ErrorCode } from '@hexagonal-monorepo-template/domain';

export const expenseCategorySchema = z.object({
  label: z.string().trim().min(1, ErrorCode.REQUIRED_INFORMATION),
});

export type ExpenseCategoryValues = z.infer<typeof expenseCategorySchema>;
