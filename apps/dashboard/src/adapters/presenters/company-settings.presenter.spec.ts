import { describe, expect, it } from 'vitest';
import { DayOfWeek, ErrorCode } from '@hexagonal-monorepo-template/domain';
import {
  presentCompanySettings,
  presentError,
} from './company-settings.presenter';
import { fr } from '../../infrastructure/ui/i18n/fr';

describe('presentCompanySettings', () => {
  it('marks selected weekdays for the view', () => {
    const view = presentCompanySettings({
      id: 'c1',
      name: 'Acme',
      nonWorkingWeekdays: [DayOfWeek.SUNDAY],
      publicHolidays: [],
    });

    expect(view.weekdays.find((day) => day.value === DayOfWeek.SUNDAY)?.selected).toBe(
      true,
    );
    expect(view.weekdays.find((day) => day.value === DayOfWeek.MONDAY)?.selected).toBe(
      false,
    );
  });
});

describe('presentError', () => {
  it('maps ACCESS_DENIED to the french phrase', () => {
    expect(presentError(new Error(ErrorCode.ACCESS_DENIED))).toBe(
      fr.errors.ACCESS_DENIED,
    );
  });
});
