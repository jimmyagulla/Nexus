import { InMemoryKeyValueStorage } from '@hexagonal-monorepo-template/adapters';
import { createSeenItemsStore, SEEN_DOCUMENTS_KEY, SEEN_PAYSLIPS_KEY } from './seen-items.store';

describe('seen items store', () => {
  it('starts with nothing seen on a new device', () => {
    expect(createSeenItemsStore(new InMemoryKeyValueStorage(), SEEN_PAYSLIPS_KEY).getState().seenIds.size).toBe(0);
  });

  it('remembers the items seen from one visit to the next', () => {
    const storage = new InMemoryKeyValueStorage();

    createSeenItemsStore(storage, SEEN_PAYSLIPS_KEY).getState().markSeen(['p1', 'p2']);
    createSeenItemsStore(storage, SEEN_PAYSLIPS_KEY).getState().markSeen(['p2', 'p3']);

    expect([...createSeenItemsStore(storage, SEEN_PAYSLIPS_KEY).getState().seenIds]).toEqual(['p1', 'p2', 'p3']);
  });

  it('keeps each kind of item apart', () => {
    const storage = new InMemoryKeyValueStorage();

    createSeenItemsStore(storage, SEEN_DOCUMENTS_KEY).getState().markSeen(['d1']);

    expect(createSeenItemsStore(storage, SEEN_PAYSLIPS_KEY).getState().seenIds.size).toBe(0);
    expect([...createSeenItemsStore(storage, SEEN_DOCUMENTS_KEY).getState().seenIds]).toEqual(['d1']);
  });

  it('keeps the same state when everything was already seen', () => {
    const store = createSeenItemsStore(new InMemoryKeyValueStorage(), SEEN_PAYSLIPS_KEY);
    store.getState().markSeen(['p1']);
    const before = store.getState().seenIds;

    store.getState().markSeen(['p1']);

    expect(store.getState().seenIds).toBe(before);
  });

  it.each(['not json', '{"p1":true}', '[1,"p2"]'])('ignores what it cannot read back: %s', (kept) => {
    const storage = new InMemoryKeyValueStorage(new Map([[SEEN_PAYSLIPS_KEY, kept]]));

    expect([...createSeenItemsStore(storage, SEEN_PAYSLIPS_KEY).getState().seenIds]).toEqual(kept === '[1,"p2"]' ? ['p2'] : []);
  });
});
