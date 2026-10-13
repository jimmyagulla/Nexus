import { PresenceMonth } from '../value-objects/presence-month';

export class Presence {
  constructor(
    readonly id: string,
    readonly companyId: string,
    readonly employeeId: string,
    readonly month: PresenceMonth,
    readonly workedDays: number,
  ) {}
}
