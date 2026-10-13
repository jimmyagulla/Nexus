import { z } from 'zod';
import {
  ErrorCode,
  PRESENCE_MONTH_PATTERN,
} from '@hexagonal-monorepo-template/domain';

export const openPresenceSchema = z.object({
  employeeId: z.string().min(1, ErrorCode.REQUIRED_INFORMATION),
  month: z.string().regex(PRESENCE_MONTH_PATTERN, ErrorCode.REQUIRED_INFORMATION),
});

export type OpenPresenceValues = z.infer<typeof openPresenceSchema>;
