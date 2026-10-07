import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SystemClock } from './system-clock';

const instant = new Date('2026-10-06T10:00:00.000Z');

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(instant);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('SystemClock', () => {
  it('reads the current system instant', () => {
    expect(new SystemClock().now()).toEqual(instant);
  });

  it('follows the system clock as time advances', () => {
    const clock = new SystemClock();

    vi.advanceTimersByTime(60_000);

    expect(clock.now()).toEqual(new Date('2026-10-06T10:01:00.000Z'));
  });

  it('hands back a fresh instant on every reading, so a caller cannot corrupt the next one', () => {
    const clock = new SystemClock();

    clock.now().setUTCFullYear(1999);

    expect(clock.now()).toEqual(instant);
  });
});
