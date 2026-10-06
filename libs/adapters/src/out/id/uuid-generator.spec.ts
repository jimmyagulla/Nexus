import { describe, expect, it } from 'vitest';
import { UuidGenerator } from './uuid-generator';

const UUID_V4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe('UuidGenerator', () => {
  it('hands back a version 4 uuid', () => {
    expect(new UuidGenerator().next()).toMatch(UUID_V4);
  });

  it('never hands back the same id twice', () => {
    const ids = new UuidGenerator();

    const generated = Array.from({ length: 100 }, () => ids.next());

    expect(new Set(generated).size).toBe(100);
  });

  it('keeps two generators from colliding', () => {
    const ids = new UuidGenerator();
    const other = new UuidGenerator();

    expect(ids.next()).not.toBe(other.next());
  });
});
