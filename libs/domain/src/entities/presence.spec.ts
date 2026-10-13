import { ErrorCode } from '../errors/error-code';
import { PresenceMonth } from '../value-objects/presence-month';
import { Presence } from './presence';

const at = new Date('2026-10-13T09:00:00.000Z');

function october(workedDays = 22): Presence {
  return new Presence('p1', 'c1', 'e1', PresenceMonth.parse('2026-10'), workedDays);
}

describe('Presence', () => {
  it('starts with the proposed days and no adjustment', () => {
    const presence = october(22);

    expect(presence.workedDays).toBe(22);
    expect(presence.proposedWorkedDays).toBe(22);
    expect(presence.adjustments).toEqual([]);
  });

  it('keeps the adjusted days and remembers the proposed ones', () => {
    const adjusted = october(22).adjustWorkedDays(20, 'user-1', at);

    expect(adjusted.workedDays).toBe(20);
    expect(adjusted.proposedWorkedDays).toBe(22);
  });

  it('records who changed what and when, with the days before and after', () => {
    const adjusted = october(22).adjustWorkedDays(20, 'user-1', at);

    expect(adjusted.adjustments).toEqual([
      { actorId: 'user-1', occurredAt: at, before: 22, after: 20 },
    ]);
  });

  it('records each adjustment after the previous one', () => {
    const later = new Date('2026-10-14T09:00:00.000Z');
    const adjusted = october(22)
      .adjustWorkedDays(20, 'user-1', at)
      .adjustWorkedDays(21, 'user-2', later);

    expect(adjusted.adjustments).toEqual([
      { actorId: 'user-1', occurredAt: at, before: 22, after: 20 },
      { actorId: 'user-2', occurredAt: later, before: 20, after: 21 },
    ]);
    expect(adjusted.proposedWorkedDays).toBe(22);
  });

  it('leaves the presence it adjusts untouched', () => {
    const original = october(22);

    original.adjustWorkedDays(20, 'user-1', at);

    expect(original.workedDays).toBe(22);
    expect(original.adjustments).toEqual([]);
  });

  it('records nothing when the days do not change', () => {
    const adjusted = october(22).adjustWorkedDays(22, 'user-1', at);

    expect(adjusted.adjustments).toEqual([]);
  });

  it('accepts no worked day at all', () => {
    expect(october(22).adjustWorkedDays(0, 'user-1', at).workedDays).toBe(0);
  });

  it('accepts every day of the month', () => {
    expect(october(22).adjustWorkedDays(31, 'user-1', at).workedDays).toBe(31);
  });

  it('refuses more days than the month holds', () => {
    expect(() => october(22).adjustWorkedDays(32, 'user-1', at)).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });

  it('refuses a negative number of days', () => {
    expect(() => october(22).adjustWorkedDays(-1, 'user-1', at)).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });

  it('refuses a fraction of a day', () => {
    expect(() => october(22).adjustWorkedDays(20.5, 'user-1', at)).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });

  it('refuses a value that is not a number', () => {
    expect(() => october(22).adjustWorkedDays(Number.NaN, 'user-1', at)).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });

  it('counts the days of the month it belongs to', () => {
    const february = new Presence(
      'p2',
      'c1',
      'e1',
      PresenceMonth.parse('2026-02'),
      20,
    );

    expect(() => february.adjustWorkedDays(29, 'user-1', at)).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
    expect(february.adjustWorkedDays(28, 'user-1', at).workedDays).toBe(28);
  });
});
