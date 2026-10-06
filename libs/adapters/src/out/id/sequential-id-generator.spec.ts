import { describe, expect, it } from 'vitest';
import { SequentialIdGenerator } from './sequential-id-generator';

describe('SequentialIdGenerator', () => {
  it('starts the sequence at the first id', () => {
    expect(new SequentialIdGenerator().next()).toBe('id-1');
  });

  it('progresses on every call', () => {
    const ids = new SequentialIdGenerator();

    expect([ids.next(), ids.next(), ids.next()]).toEqual([
      'id-1',
      'id-2',
      'id-3',
    ]);
  });

  it('never hands back the same id twice', () => {
    const ids = new SequentialIdGenerator();

    const generated = Array.from({ length: 100 }, () => ids.next());

    expect(new Set(generated).size).toBe(100);
  });

  it('keeps two generators on independent sequences', () => {
    const ids = new SequentialIdGenerator();
    const other = new SequentialIdGenerator();

    ids.next();
    ids.next();

    expect(other.next()).toBe('id-1');
  });
});
