import { describe, expect, it } from 'vitest';
import type { PersonalInfoSnapshot } from '@hexagonal-monorepo-template/domain';
import { LocalDatePresenter } from './local-date.presenter';
import { PersonalInfoLastUpdatePresenter } from './personal-info-last-update.presenter';

/** 3 October 2026, 10:41 on the device. */
const updatedAt = new Date(2026, 9, 3, 10, 41);
const info = { updatedAt: updatedAt.toISOString() } as PersonalInfoSnapshot;

describe('LocalDatePresenter', () => {
  it('presents the day and the time on the device', () => {
    expect(new LocalDatePresenter().present(new Date(2026, 0, 5, 7, 3))).toEqual({ day: '05/01/2026', time: '07:03' });
  });
});

describe('PersonalInfoLastUpdatePresenter', () => {
  it('presents the day of the last change', () => {
    expect(new PersonalInfoLastUpdatePresenter(new LocalDatePresenter()).present(info)).toBe('Dernière mise à jour le 03/10/2026');
  });
});
