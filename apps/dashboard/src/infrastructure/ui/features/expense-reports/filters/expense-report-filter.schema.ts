import { z } from 'zod';
import {
  CALENDAR_DATE_PATTERN,
  ErrorCode,
  ExpenseReportFilterInput,
  ExpenseReportStatus,
} from '@hexagonal-monorepo-template/domain';

function toNumber(raw: string): number {
  return Number(raw.trim().replace(',', '.'));
}

const optionalDate = z
  .string()
  .refine(
    (raw) => raw === '' || CALENDAR_DATE_PATTERN.test(raw),
    ErrorCode.REQUIRED_INFORMATION,
  );

const optionalAmount = z
  .string()
  .trim()
  .refine(
    (raw) => raw === '' || toNumber(raw) >= 0,
    ErrorCode.INVALID_AMOUNT,
  );

export const expenseReportFilterSchema = z
  .object({
    employeeId: z.string().trim(),
    status: z.string(),
    from: optionalDate,
    to: optionalDate,
    minAmount: optionalAmount,
    maxAmount: optionalAmount,
  })
  .superRefine((values, context) => {
    if (values.from !== '' && values.to !== '' && values.to < values.from) {
      context.addIssue({
        code: 'custom',
        path: ['to'],
        message: ErrorCode.INVALID_PERIOD,
      });
    }
  })
  .transform((values): ExpenseReportFilterInput => {
    const filter: ExpenseReportFilterInput = {};
    if (values.employeeId !== '') {
      filter.employeeId = values.employeeId;
    }
    if (values.status !== '') {
      filter.status = values.status as ExpenseReportStatus;
    }
    if (values.from !== '') {
      filter.from = values.from;
    }
    if (values.to !== '') {
      filter.to = values.to;
    }
    if (values.minAmount !== '') {
      filter.minAmount = toNumber(values.minAmount);
    }
    if (values.maxAmount !== '') {
      filter.maxAmount = toNumber(values.maxAmount);
    }
    return filter;
  });

export type ExpenseReportFilterFormValues = z.input<
  typeof expenseReportFilterSchema
>;
