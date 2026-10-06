import * as z from 'zod';
import { ErrorMessage } from '@hexagonal-monorepo-template/domain';

export const holidaySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, ErrorMessage.INFORMATION_OBLIGATOIRE),
  label: z.string().trim().min(1, ErrorMessage.INFORMATION_OBLIGATOIRE),
});

export type HolidayValues = z.infer<typeof holidaySchema>;
