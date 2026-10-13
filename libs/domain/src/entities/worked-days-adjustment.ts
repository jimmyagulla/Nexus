export class WorkedDaysAdjustment {
  constructor(
    readonly actorId: string,
    readonly occurredAt: Date,
    readonly before: number,
    readonly after: number,
  ) {}
}
