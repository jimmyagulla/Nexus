import { describe, expect, it, vi } from 'vitest';
import {
  IAddCompanyHolidayFromClient,
  ICreateCompanyFromClient,
  ILoadCompanySettingsFromClient,
  IRemoveCompanyHolidayFromClient,
  IUpdateCompanyNameFromClient,
  IUpdateNonWorkingWeekdaysFromClient,
} from '@hexagonal-monorepo-template/ports';
import { CompanySettingsController } from './company-settings.controller';

const snapshot = {
  id: 'c1',
  name: 'Acme',
  nonWorkingWeekdays: [1, 6],
  holidays: [],
};

describe('CompanySettingsController', () => {
  it('forwards each client action to its inbound port', async () => {
    const loadSettings: ILoadCompanySettingsFromClient = {
      execute: vi.fn().mockResolvedValue(snapshot),
    };
    const createCompany: ICreateCompanyFromClient = {
      execute: vi.fn().mockResolvedValue(snapshot),
    };
    const updateName: IUpdateCompanyNameFromClient = {
      execute: vi.fn().mockResolvedValue(snapshot),
    };
    const updateWeekdays: IUpdateNonWorkingWeekdaysFromClient = {
      execute: vi.fn().mockResolvedValue(snapshot),
    };
    const addHoliday: IAddCompanyHolidayFromClient = {
      execute: vi.fn().mockResolvedValue(snapshot),
    };
    const removeHoliday: IRemoveCompanyHolidayFromClient = {
      execute: vi.fn().mockResolvedValue(snapshot),
    };
    const controller = new CompanySettingsController(
      loadSettings,
      createCompany,
      updateName,
      updateWeekdays,
      addHoliday,
      removeHoliday,
    );

    await controller.load({ companyId: 'c1' });
    await controller.create({ name: 'Acme' });
    await controller.rename({ companyId: 'c1', name: 'Acme' });
    await controller.setWeekdays({ companyId: 'c1', weekdays: [1, 6] });
    await controller.addPublicHoliday({
      companyId: 'c1',
      date: '2026-07-14',
      label: 'Fête nationale',
    });
    await controller.removePublicHoliday({ companyId: 'c1', holidayId: 'h1' });

    expect(loadSettings.execute).toHaveBeenCalledWith({ companyId: 'c1' });
    expect(createCompany.execute).toHaveBeenCalledWith({ name: 'Acme' });
    expect(updateName.execute).toHaveBeenCalledWith({
      companyId: 'c1',
      name: 'Acme',
    });
    expect(updateWeekdays.execute).toHaveBeenCalledWith({
      companyId: 'c1',
      weekdays: [1, 6],
    });
    expect(addHoliday.execute).toHaveBeenCalledWith({
      companyId: 'c1',
      date: '2026-07-14',
      label: 'Fête nationale',
    });
    expect(removeHoliday.execute).toHaveBeenCalledWith({
      companyId: 'c1',
      holidayId: 'h1',
    });
  });
});
