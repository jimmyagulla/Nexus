import { MockDb } from './mock-db';

describe('MockDb', () => {
  it('returns a seeded record by table and key', () => {
    const db = new MockDb({
      greetings: { default: { message: 'Hello API' } },
    });

    expect(db.get('greetings', 'default')).toEqual({ message: 'Hello API' });
  });

  it('returns undefined for an unknown key', () => {
    const db = new MockDb({
      greetings: { default: { message: 'Hello API' } },
    });

    expect(db.get('greetings', 'missing')).toBeUndefined();
  });

  it('stores a record via seed() and reads it back', () => {
    const db = new MockDb();

    db.seed('greetings', 'default', { message: 'Hello API' });

    expect(db.get('greetings', 'default')).toEqual({ message: 'Hello API' });
  });
});
