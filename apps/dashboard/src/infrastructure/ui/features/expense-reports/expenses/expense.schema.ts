import { z } from 'zod';
import {
  CALENDAR_DATE_PATTERN,
  ErrorCode,
} from '@hexagonal-monorepo-template/domain';

function toNumber(raw: string): number {
  return Number(raw.trim().replace(',', '.'));
}

const requiredText = z.string().trim().min(1, ErrorCode.REQUIRED_INFORMATION);

export const expenseSchema = z
  .object({
    date: z.string().regex(CALENDAR_DATE_PATTERN, ErrorCode.REQUIRED_INFORMATION),
    categoryId: requiredText,
    amount: z
      .string()
      .trim()
      .min(1, ErrorCode.REQUIRED_INFORMATION)
      .refine((raw) => toNumber(raw) > 0, ErrorCode.INVALID_AMOUNT),
    vat: z
      .string()
      .trim()
      .refine((raw) => raw === '' || toNumber(raw) >= 0, ErrorCode.INVALID_VAT),
    paymentMethod: requiredText,
    description: requiredText,
    assignment: requiredText,
  })
  .superRefine((values, context) => {
    if (values.vat !== '' && toNumber(values.vat) > toNumber(values.amount)) {
      context.addIssue({
        code: 'custom',
        path: ['vat'],
        message: ErrorCode.INVALID_VAT,
      });
    }
  })
  .transform((values) => ({
    date: values.date,
    categoryId: values.categoryId,
    amount: toNumber(values.amount),
    vat: values.vat === '' ? null : toNumber(values.vat),
    paymentMethod: values.paymentMethod,
    description: values.description,
    assignment: values.assignment,
  }));

export type ExpenseFormValues = z.input<typeof expenseSchema>;
export type ExpenseValues = z.output<typeof expenseSchema>;
