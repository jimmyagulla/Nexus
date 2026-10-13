import { z } from 'zod';
import {
  ErrorCode,
  PRESENCE_MONTH_PATTERN,
  PresenceListFilter,
} from '@hexagonal-monorepo-template/domain';

export const ALL_EMPLOYEES = 'all';

const optionalMonth = z
  .string()
  .refine(
    (value) => value === '' || PRESENCE_MONTH_PATTERN.test(value),
    ErrorCode.REQUIRED_INFORMATION,
  );

export const presenceFiltersSchema = z
  .object({
    employeeId: z.string(),
    from: optionalMonth,
    to: optionalMonth,
  })
  .superRefine((values, context) => {
    if (values.from !== '' && values.to !== '' && values.to < values.from) {
      context.addIssue({
        code: 'custom',
        path: ['to'],
        message: ErrorCode.INVALID_PERIOD,
      });
    }
  });

export type PresenceFiltersValues = z.infer<typeof presenceFiltersSchema>;

export function toPresenceListFilter(
  values: PresenceFiltersValues,
): PresenceListFilter {
  return {
    ...(values.employeeId === ALL_EMPLOYEES
      ? {}
      : { employeeId: values.employeeId }),
    ...(values.from === '' ? {} : { from: values.from }),
    ...(values.to === '' ? {} : { to: values.to }),
  };
}
