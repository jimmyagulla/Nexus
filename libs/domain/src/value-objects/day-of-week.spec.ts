import { isDayOfWeek } from './day-of-week';

describe('isDayOfWeek', () => {
  it('recognises the seven days of the week', () => {
    expect(
      [
        'SUNDAY',
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY',
      ].filter((day) => !isDayOfWeek(day)),
    ).toEqual([]);
  });

  it('refuses a day outside the week', () => {
    expect(isDayOfWeek('CARAMBA')).toBe(false);
  });

  it('refuses a known day written in another case', () => {
    expect(isDayOfWeek('monday')).toBe(false);
  });

  it('refuses an empty day', () => {
    expect(isDayOfWeek('')).toBe(false);
  });

  it('refuses a property inherited from the object prototype', () => {
    expect(isDayOfWeek('toString')).toBe(false);
  });
});
