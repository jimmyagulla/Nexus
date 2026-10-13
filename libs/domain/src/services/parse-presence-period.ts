import { ErrorCode } from '../errors/error-code';
import { PresenceMonth } from '../value-objects/presence-month';

export type PresencePeriod = {
  from: PresenceMonth | undefined;
  to: PresenceMonth | undefined;
};

export function parsePresencePeriod(
  from: string | undefined,
  to: string | undefined,
): PresencePeriod {
  const period = {
    from: from === undefined ? undefined : PresenceMonth.parse(from),
    to: to === undefined ? undefined : PresenceMonth.parse(to),
  };
  if (
    period.from !== undefined &&
    period.to !== undefined &&
    period.to.value < period.from.value
  ) {
    throw new Error(ErrorCode.INVALID_PERIOD);
  }

  return period;
}
