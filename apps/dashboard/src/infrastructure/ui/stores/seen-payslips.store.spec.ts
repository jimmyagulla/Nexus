import { InMemoryKeyValueStorage } from '@hexagonal-monorepo-template/adapters';
import { createSeenPayslipsStore, SEEN_PAYSLIPS_KEY } from './seen-payslips.store';

describe('seen payslips store', () => {
  it('starts with nothing seen on a new device', () => {
    expect(createSeenPayslipsStore(new InMemoryKeyValueStorage()).getState().seenIds.size).toBe(0);
  });

  it('remembers the payslips seen from one visit to the next', () => {
    const storage = new InMemoryKeyValueStorage();

    createSeenPayslipsStore(storage).getState().markSeen(['p1', 'p2']);
    createSeenPayslipsStore(storage).getState().markSeen(['p2', 'p3']);

    expect([...createSeenPayslipsStore(storage).getState().seenIds]).toEqual(['p1', 'p2', 'p3']);
  });

  it('keeps the same state when everything was already seen', () => {
    const store = createSeenPayslipsStore(new InMemoryKeyValueStorage());
    store.getState().markSeen(['p1']);
    const before = store.getState().seenIds;

    store.getState().markSeen(['p1']);

    expect(store.getState().seenIds).toBe(before);
  });

  it.each(['not json', '{"p1":true}', '[1,"p2"]'])('ignores what it cannot read back: %s', (kept) => {
    const storage = new InMemoryKeyValueStorage(new Map([[SEEN_PAYSLIPS_KEY, kept]]));

    expect([...createSeenPayslipsStore(storage).getState().seenIds]).toEqual(kept === '[1,"p2"]' ? ['p2'] : []);
  });
});
