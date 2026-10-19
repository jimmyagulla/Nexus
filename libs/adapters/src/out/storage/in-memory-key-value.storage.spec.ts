import { describe, expect, it } from 'vitest';
import { InMemoryKeyValueStorage } from './in-memory-key-value.storage';

describe('InMemoryKeyValueStorage', () => {
  it('reads back what was written under a key', () => {
    const storage = new InMemoryKeyValueStorage();

    storage.write('k', 'v1');
    storage.write('k', 'v2');

    expect(storage.read('k')).toBe('v2');
  });

  it('reads nothing under a key never written', () => {
    expect(new InMemoryKeyValueStorage().read('k')).toBeNull();
  });
});
