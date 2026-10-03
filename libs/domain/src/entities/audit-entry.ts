export class AuditEntry {
  constructor(
    readonly companyId: string,
    readonly action: string,
    readonly objectLabel: string,
    readonly readablePhrase: string,
    readonly before: string | null,
    readonly after: string | null,
    readonly occurredAt: Date,
  ) {}
}
