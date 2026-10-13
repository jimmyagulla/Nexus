import { HoursFact } from '../facts/hours-fact';
import { HoursFactStatus } from '../facts/hours-fact-status';
import { PresenceMonth } from '../value-objects/presence-month';

export function selectHoursToProcess(
  month: PresenceMonth,
  facts: readonly HoursFact[],
): HoursFact[] {
  return facts.filter(
    (fact) =>
      fact.status === HoursFactStatus.VALIDATED && month.contains(fact.date),
  );
}
