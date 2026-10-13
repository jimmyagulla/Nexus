import { z } from 'zod';
import {
  ErrorCode,
  RECEIPT_MIME_TYPES,
} from '@hexagonal-monorepo-template/domain';

const ACCEPTED_TYPES: readonly string[] = RECEIPT_MIME_TYPES;

export const receiptSchema = z.object({
  file: z
    .instanceof(File, { message: ErrorCode.MISSING_DOCUMENT })
    .refine((file) => file.size > 0, ErrorCode.INVALID_FILE)
    .refine((file) => ACCEPTED_TYPES.includes(file.type), ErrorCode.INVALID_FILE),
});

export type ReceiptValues = z.infer<typeof receiptSchema>;
