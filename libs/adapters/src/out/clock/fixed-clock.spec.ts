import { afterEach, describe, expect, it, vi } from 'vitest';
import { FixedClock } from './fixed-clock';

const instant = new Date('2026-10-06T10:00:00.000Z');

afterEach(() => {
  vi.useRealTimers();
});

describe('FixedClock', () => {
  it('reads the instant it was built with', () => {
    expect(new FixedClock(instant).now()).toEqual(instant);
  });

  it('does not drift while the system clock advances', () => {
    vi.useFakeTimers();
    vi.setSystemTime(instant);
    const clock = new FixedClock(instant);

    vi.advanceTimersByTime(60_000);

    expect(clock.now()).toEqual(instant);
  });

  it('ignores the system clock entirely', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('1999-12-31T23:59:59.000Z'));

    expect(new FixedClock(instant).now()).toEqual(instant);
  });
});
