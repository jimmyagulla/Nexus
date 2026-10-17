import { describe, expect, it } from 'vitest';
import { RandomUuidGenerator } from './random-uuid-generator';

describe('RandomUuidGenerator', () => {
  it('hands out version 4 UUIDs', () => {
    expect(new RandomUuidGenerator().next()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
  });

  it('never hands out the same identifier twice in a row', () => {
    const ids = new RandomUuidGenerator();

    expect(ids.next()).not.toBe(ids.next());
  });
});
