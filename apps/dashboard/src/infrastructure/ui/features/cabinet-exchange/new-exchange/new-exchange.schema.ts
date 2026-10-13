import { z } from 'zod';
import {
  ErrorCode,
  EXCHANGE_FILE_MIME_TYPES,
} from '@hexagonal-monorepo-template/domain';

const ACCEPTED_TYPES: readonly string[] = EXCHANGE_FILE_MIME_TYPES;

export const newExchangeSchema = z.object({
  category: z.string().trim().min(1, ErrorCode.REQUIRED_INFORMATION),
  file: z
    .custom<FileList>()
    .refine((files) => files.length > 0, ErrorCode.MISSING_DOCUMENT)
    .refine(
      (files) =>
        files.length === 0 ||
        (ACCEPTED_TYPES.includes(files[0]?.type ?? '') &&
          (files[0]?.size ?? 0) > 0),
      ErrorCode.INVALID_FILE,
    ),
});

export type NewExchangeFormValues = z.infer<typeof newExchangeSchema>;

export type NewExchangeValues = { category: string; file: File };
