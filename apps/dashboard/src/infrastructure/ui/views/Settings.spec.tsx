import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { DayOfWeek } from '@hexagonal-monorepo-template/domain';
import type { CompanySettingsViewModel } from '../../../adapters/presenters/company-settings.presenter';
import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import type { PublicHolidayValues } from '../features/company-settings/public-holidays/public-holiday.schema';
import { i18n } from '../i18n/i18n';
import { Settings } from './Settings';

const acme: CompanySettingsViewModel = {
  id: 'c1',
  name: 'Acme',
  weekdays: Object.values(DayOfWeek).map((value) => ({
    value,
    label: i18n.messages.days[value],
    selected: value === DayOfWeek.SUNDAY,
  })),
  selectedWeekdays: [DayOfWeek.SUNDAY],
  publicHolidays: [{ id: 'ph-1', date: '14/07/2026', label: 'Fête nationale' }],
};

type Refusals = {
  renameError?: string;
  weekdaysError?: string;
  addHolidayError?: string;
  removeHolidayError?: string;
};

function renderSettings(
  model: CompanySettingsViewModel = acme,
  refusals: Refusals = {},
) {
  const renamed: string[] = [];
  const savedWeekdays: DayOfWeek[][] = [];
  const addedHolidays: PublicHolidayValues[] = [];
  const removedHolidays: string[] = [];

  render(
    <Settings
      model={model}
      errorPresenter={new ErrorPresenter()}
      renameError={refusals.renameError ?? null}
      weekdaysError={refusals.weekdaysError ?? null}
      addHolidayError={refusals.addHolidayError ?? null}
      removeHolidayError={refusals.removeHolidayError ?? null}
      onRename={async (name) => {
        renamed.push(name);
      }}
      onSaveWeekdays={async (weekdays) => {
        savedWeekdays.push([...weekdays]);
      }}
      onAddHoliday={async (values) => {
        addedHolidays.push(values);
        return true;
      }}
      onRemoveHoliday={(id) => removedHolidays.push(id)}
    />,
  );

  return { renamed, savedWeekdays, addedHolidays, removedHolidays };
}

describe('Settings', () => {
  it('names the screen and the public holidays section', () => {
    renderSettings();

    expect(
      screen.getByRole('heading', { name: i18n.messages.settings.title }),
    ).toBeTruthy();
    expect(
      screen.getByRole('heading', { name: i18n.messages.settings.publicHolidays }),
    ).toBeTruthy();
  });

  it('shows the company settings as they stand', () => {
    renderSettings();

    expect(
      screen.getByLabelText<HTMLInputElement>(i18n.messages.settings.name).value,
    ).toBe('Acme');
    expect(
      screen.getByLabelText<HTMLInputElement>(i18n.messages.days.SUNDAY).checked,
    ).toBe(true);
    expect(screen.getByText('14/07/2026 — Fête nationale')).toBeTruthy();
  });

  it('hands the new company name to its caller', async () => {
    const { renamed } = renderSettings();

    fireEvent.change(screen.getByLabelText(i18n.messages.settings.name), {
      target: { value: 'Nexus' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: i18n.messages.settings.saveName }),
    );

    await waitFor(() => expect(renamed).toEqual(['Nexus']));
  });

  it('hands the retained weekdays to its caller', async () => {
    const { savedWeekdays } = renderSettings();

    fireEvent.click(screen.getByLabelText(i18n.messages.days.SATURDAY));
    fireEvent.click(
      screen.getByRole('button', { name: i18n.messages.settings.saveWeekdays }),
    );

    await waitFor(() =>
      expect(savedWeekdays).toEqual([[DayOfWeek.SUNDAY, DayOfWeek.SATURDAY]]),
    );
  });

  it('hands the public holiday to remove to its caller', () => {
    const { removedHolidays } = renderSettings();

    fireEvent.click(
      screen.getByRole('button', { name: i18n.messages.settings.removeHoliday }),
    );

    expect(removedHolidays).toEqual(['ph-1']);
  });

  it('announces an empty calendar', () => {
    renderSettings({ ...acme, publicHolidays: [] });

    expect(screen.getByText(i18n.messages.settings.noPublicHolidays)).toBeTruthy();
  });

  it('surfaces every refusal it is handed', () => {
    renderSettings(acme, {
      renameError: 'Renommage refusé',
      weekdaysError: 'Jours refusés',
      removeHolidayError: 'Retrait refusé',
    });

    expect(
      screen.getAllByRole('alert').map((alert) => alert.textContent),
    ).toEqual(['Renommage refusé', 'Jours refusés', 'Retrait refusé']);
  });

  it('reports nothing while no refusal is handed', () => {
    renderSettings();

    expect(screen.queryByRole('alert')).toBeNull();
  });
});
