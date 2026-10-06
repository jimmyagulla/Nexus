import { describe, expect, it } from 'vitest';
import { CompanySettingsPresenter } from './company-settings.presenter';

describe('CompanySettingsPresenter', () => {
  it('prepares weekday labels and holiday captions for the view', () => {
    const view = new CompanySettingsPresenter().present({
      id: 'c1',
      name: 'Acme',
      nonWorkingWeekdays: [1, 0],
      holidays: [{ id: 'h1', date: '2026-07-14', label: 'Fête nationale' }],
    });

    expect(view).toEqual({
      id: 'c1',
      name: 'Acme',
      weekdays: [
        { value: 1, label: 'Lundi', selected: true },
        { value: 2, label: 'Mardi', selected: false },
        { value: 3, label: 'Mercredi', selected: false },
        { value: 4, label: 'Jeudi', selected: false },
        { value: 5, label: 'Vendredi', selected: false },
        { value: 6, label: 'Samedi', selected: false },
        { value: 0, label: 'Dimanche', selected: true },
      ],
      holidays: [{ id: 'h1', caption: '2026-07-14 — Fête nationale' }],
    });
  });
});
