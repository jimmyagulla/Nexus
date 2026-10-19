import { z } from 'zod';
import {
  CALENDAR_DATE_PATTERN,
  ErrorCode,
  EXPENSE_AMOUNT_PATTERN,
  EXPENSE_REPORT_DESCRIPTION_MAX_LENGTH,
  EXPENSE_REPORT_PROJECT_MAX_LENGTH,
  ExpenseAmount,
  isErrorCode,
  isExpenseReportCategory,
  isExpenseReportPaymentMethod,
  prepareExpenseReportProof,
} from '@hexagonal-monorepo-template/domain';

/** Checks a picked receipt with the rules of the API: size, then real format. */
async function proofProblem(file: File): Promise<string | null> {
  try {
    prepareExpenseReportProof({ fileName: file.name, content: new Uint8Array(await file.arrayBuffer()) });
    return null;
  } catch (error) {
    return error instanceof Error && isErrorCode(error.message)
      ? error.message
      : ErrorCode.UNSUPPORTED_FILE_FORMAT;
  }
}

export const expenseReportSchema = z.object({
  date: z.string().regex(CALENDAR_DATE_PATTERN, ErrorCode.REQUIRED_INFORMATION),
  category: z.string().refine((category): boolean => isExpenseReportCategory(category), ErrorCode.REQUIRED_INFORMATION),
  paymentMethod: z.string().refine((method): boolean => isExpenseReportPaymentMethod(method), ErrorCode.REQUIRED_INFORMATION),
  amount: z
    .string()
    .trim()
    .min(1, ErrorCode.REQUIRED_INFORMATION)
    .regex(EXPENSE_AMOUNT_PATTERN, ErrorCode.INVALID_INFORMATION)
    .refine((amount) => (ExpenseAmount.read(amount)?.cents ?? 0) > 0, ErrorCode.INVALID_INFORMATION),
  vatRate: z.string(),
  description: z
    .string()
    .trim()
    .min(1, ErrorCode.REQUIRED_INFORMATION)
    .max(EXPENSE_REPORT_DESCRIPTION_MAX_LENGTH, ErrorCode.INVALID_INFORMATION),
  project: z
    .string()
    .trim()
    .max(EXPENSE_REPORT_PROJECT_MAX_LENGTH, ErrorCode.INVALID_INFORMATION),
  proof: z
    .instanceof(File)
    .nullable()
    .superRefine(async (file, context) => {
      const problem = file === null ? null : await proofProblem(file);
      if (problem !== null) {
        context.addIssue({ code: 'custom', message: problem });
      }
    }),
  keepProof: z.boolean(),
});

export type ExpenseReportValues = z.infer<typeof expenseReportSchema>;
