import { ErrorCode } from '../errors/error-code';
import { PresenceMonth } from '../value-objects/presence-month';
import { WorkedDaysAdjustment } from './worked-days-adjustment';

export class Presence {
  constructor(
    readonly id: string,
    readonly companyId: string,
    readonly employeeId: string,
    readonly month: PresenceMonth,
    readonly workedDays: number,
    readonly proposedWorkedDays: number = workedDays,
    readonly adjustments: readonly WorkedDaysAdjustment[] = [],
  ) {}

  adjustWorkedDays(days: number, actorId: string, at: Date): Presence {
    this.requireDaysOfTheMonth(days);
    if (days === this.workedDays) {
      return this;
    }

    return new Presence(
      this.id,
      this.companyId,
      this.employeeId,
      this.month,
      days,
      this.proposedWorkedDays,
      [
        ...this.adjustments,
        new WorkedDaysAdjustment(actorId, at, this.workedDays, days),
      ],
    );
  }

  private requireDaysOfTheMonth(days: number): void {
    if (
      !Number.isInteger(days) ||
      days < 0 ||
      days > this.month.days().length
    ) {
      throw new Error(ErrorCode.REQUIRED_INFORMATION);
    }
  }
}
