export type MockDbRecord = Record<string, unknown>;
export type MockDbSeed = Record<string, Record<string, MockDbRecord>>;

/**
 * Minimal in-memory stand-in for a real DB client. Generic and business
 * agnostic: it stores and returns plain records only, and never knows about
 * domain types. Callers seed their own tables.
 */
export class MockDb {
  private readonly store: MockDbSeed;

  constructor(seed: MockDbSeed = {}) {
    this.store = seed;
  }

  seed(table: string, key: string, record: MockDbRecord): void {
    (this.store[table] ??= {})[key] = record;
  }

  get(table: string, key: string): MockDbRecord | undefined {
    return this.store[table]?.[key];
  }
}
