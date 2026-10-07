import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  CompanySettingsSnapshot,
  DayOfWeek,
  ErrorCode,
} from '@hexagonal-monorepo-template/domain';
import { CompanySettingsController } from '../../../adapters/controllers/company-settings.controller';
import { CompanySettingsPresenter } from '../../../adapters/presenters/company-settings.presenter';
import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { CompanySettingsComposition } from '../../composition/company-settings.composition';
import { SettingsPage } from './SettingsPage';
import { fr } from '../i18n/fr';

type Refusals = {
  rename?: ErrorCode;
  weekdays?: ErrorCode;
  addHoliday?: ErrorCode;
  removeHoliday?: ErrorCode;
};

const acme: CompanySettingsSnapshot = {
  id: 'c1',
  name: 'Acme',
  nonWorkingWeekdays: [DayOfWeek.SUNDAY],
  publicHolidays: [
    { id: 'ph-1', date: '2026-07-14', label: 'Fête nationale' },
  ],
};

function port(refusal: ErrorCode | undefined) {
  return {
    execute: async (): Promise<CompanySettingsSnapshot> => {
      if (refusal !== undefined) {
        throw new Error(refusal);
      }
      return acme;
    },
  };
}

function compositionOf(
  getSettings: () => Promise<CompanySettingsSnapshot>,
  refusals: Refusals = {},
): CompanySettingsComposition {
  return {
    controller: new CompanySettingsController(
      { execute: getSettings },
      port(refusals.rename),
      port(refusals.weekdays),
      port(refusals.addHoliday),
      port(refusals.removeHoliday),
    ),
    presenter: new CompanySettingsPresenter(),
    errorPresenter: new ErrorPresenter(),
  };
}

function settingsOf(snapshot: CompanySettingsSnapshot) {
  return async () => snapshot;
}

async function addHolidayThroughDialog() {
  fireEvent.click(
    await screen.findByRole('button', { name: fr.settings.addHoliday }),
  );

  const dialog = within(screen.getByRole('dialog'));
  fireEvent.change(dialog.getByLabelText(fr.settings.date), {
    target: { value: '2026-07-14' },
  });
  fireEvent.change(dialog.getByLabelText(fr.settings.label), {
    target: { value: 'Fête nationale' },
  });
  fireEvent.click(
    dialog.getByRole('button', { name: fr.settings.addHoliday }),
  );
}

function renderPage(deps: CompanySettingsComposition) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={client}>
      <SettingsPage deps={deps} />
    </QueryClientProvider>,
  );
}

describe('SettingsPage', () => {
  it('shows the company name and calendar', async () => {
    renderPage(
      compositionOf(async () => ({
        id: 'c1',
        name: 'Acme',
        nonWorkingWeekdays: [DayOfWeek.SATURDAY, DayOfWeek.SUNDAY],
        publicHolidays: [],
      })),
    );

    expect(await screen.findByDisplayValue('Acme')).toBeTruthy();
    expect(
      screen.getByRole('heading', { name: fr.settings.title }),
    ).toBeTruthy();
  });

  it('lists the retained public holidays', async () => {
    renderPage(
      compositionOf(async () => ({
        id: 'c1',
        name: 'Acme',
        nonWorkingWeekdays: [],
        publicHolidays: [
          { id: 'ph-1', date: '2026-07-14', label: 'Fête nationale' },
        ],
      })),
    );

    expect(
      await screen.findByText('14/07/2026 — Fête nationale'),
    ).toBeTruthy();
  });

  it('announces an empty calendar', async () => {
    renderPage(
      compositionOf(async () => ({
        id: 'c1',
        name: 'Acme',
        nonWorkingWeekdays: [],
        publicHolidays: [],
      })),
    );

    expect(
      await screen.findByText(fr.settings.noPublicHolidays),
    ).toBeTruthy();
  });

  it('shows a readable message when the settings cannot be loaded', async () => {
    renderPage(
      compositionOf(async () => {
        throw new Error(ErrorCode.ACCESS_DENIED);
      }),
    );

    expect(
      await screen.findByText(fr.errors.ACCESS_DENIED),
    ).toBeTruthy();
  });

  it('explains why the company could not be renamed', async () => {
    renderPage(
      compositionOf(settingsOf(acme), { rename: ErrorCode.ACCESS_DENIED }),
    );

    fireEvent.change(await screen.findByLabelText(fr.settings.name), {
      target: { value: 'Nexus' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: fr.settings.saveName }),
    );

    expect((await screen.findByRole('alert')).textContent).toBe(
      fr.errors.ACCESS_DENIED,
    );
  });

  it('explains inside the dialog why the public holiday was refused', async () => {
    renderPage(
      compositionOf(settingsOf(acme), {
        addHoliday: ErrorCode.POTENTIAL_DUPLICATE,
      }),
    );

    await addHolidayThroughDialog();

    expect(
      (await within(screen.getByRole('dialog')).findByRole('alert'))
        .textContent,
    ).toBe(fr.errors.POTENTIAL_DUPLICATE);
  });

  it('keeps the dialog open when the public holiday is refused', async () => {
    renderPage(
      compositionOf(settingsOf(acme), {
        addHoliday: ErrorCode.POTENTIAL_DUPLICATE,
      }),
    );

    await addHolidayThroughDialog();

    await within(screen.getByRole('dialog')).findByRole('alert');
    expect(
      within(screen.getByRole('dialog')).getByLabelText<HTMLInputElement>(
        fr.settings.label,
      ).value,
    ).toBe('Fête nationale');
  });

  it('closes the dialog once the public holiday is retained', async () => {
    renderPage(compositionOf(settingsOf(acme)));

    await addHolidayThroughDialog();

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('explains why the non-working weekdays could not be saved', async () => {
    renderPage(
      compositionOf(settingsOf(acme), { weekdays: ErrorCode.ACCESS_DENIED }),
    );

    fireEvent.click(await screen.findByLabelText(fr.days.SATURDAY));
    fireEvent.click(
      screen.getByRole('button', { name: fr.settings.saveWeekdays }),
    );

    expect((await screen.findByRole('alert')).textContent).toBe(
      fr.errors.ACCESS_DENIED,
    );
  });

  it('explains why the public holiday could not be removed', async () => {
    renderPage(
      compositionOf(settingsOf(acme), {
        removeHoliday: ErrorCode.ACCESS_DENIED,
      }),
    );

    fireEvent.click(
      await screen.findByRole('button', { name: fr.settings.removeHoliday }),
    );

    expect((await screen.findByRole('alert')).textContent).toBe(
      fr.errors.ACCESS_DENIED,
    );
  });

  it('keeps the public holiday listed when its removal is refused', async () => {
    renderPage(
      compositionOf(settingsOf(acme), {
        removeHoliday: ErrorCode.ACCESS_DENIED,
      }),
    );

    fireEvent.click(
      await screen.findByRole('button', { name: fr.settings.removeHoliday }),
    );

    await screen.findByRole('alert');
    expect(screen.getByText('14/07/2026 — Fête nationale')).toBeTruthy();
  });
});
