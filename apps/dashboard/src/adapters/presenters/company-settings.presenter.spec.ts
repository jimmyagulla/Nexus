import { describe, expect, it } from 'vitest';
import { DayOfWeek } from '@hexagonal-monorepo-template/domain';
import { CompanySettingsPresenter } from './company-settings.presenter';
import { fr } from '../../infrastructure/ui/i18n/fr';

const presenter = new CompanySettingsPresenter();

describe('CompanySettingsPresenter', () => {
  it('marks selected weekdays for the view', () => {
    const view = presenter.present({
      id: 'c1',
      name: 'Acme',
      nonWorkingWeekdays: [DayOfWeek.SUNDAY],
      publicHolidays: [],
    });

    expect(
      view.weekdays.find((day) => day.value === DayOfWeek.SUNDAY)?.selected,
    ).toBe(true);
    expect(
      view.weekdays.find((day) => day.value === DayOfWeek.MONDAY)?.selected,
    ).toBe(false);
  });

  it('lists every weekday with its french label', () => {
    const view = presenter.present({
      id: 'c1',
      name: 'Acme',
      nonWorkingWeekdays: [],
      publicHolidays: [],
    });

    expect(view.weekdays).toHaveLength(7);
    expect(view.weekdays[0]).toEqual({
      value: DayOfWeek.SUNDAY,
      label: fr.days.SUNDAY,
      selected: false,
    });
  });

  it('hands back the selected weekdays as form defaults', () => {
    const view = presenter.present({
      id: 'c1',
      name: 'Acme',
      nonWorkingWeekdays: [DayOfWeek.SATURDAY, DayOfWeek.SUNDAY],
      publicHolidays: [],
    });

    expect(view.selectedWeekdays).toEqual([
      DayOfWeek.SATURDAY,
      DayOfWeek.SUNDAY,
    ]);
  });

  it('formats public holiday dates for a french reader', () => {
    const view = presenter.present({
      id: 'c1',
      name: 'Acme',
      nonWorkingWeekdays: [],
      publicHolidays: [
        { id: 'ph-1', date: '2026-07-14', label: 'Fête nationale' },
      ],
    });

    expect(view.publicHolidays).toEqual([
      { id: 'ph-1', date: '14/07/2026', label: 'Fête nationale' },
    ]);
  });

  it('keeps the company identity untouched', () => {
    const view = presenter.present({
      id: 'c1',
      name: 'Acme',
      nonWorkingWeekdays: [],
      publicHolidays: [],
    });

    expect(view).toMatchObject({ id: 'c1', name: 'Acme' });
  });
});
