import { requireText } from './text-rules';

export function requirePublicHolidayLabel(raw: string): string {
  return requireText(raw);
}
