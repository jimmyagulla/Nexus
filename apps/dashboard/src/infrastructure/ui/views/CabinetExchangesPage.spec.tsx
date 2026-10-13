import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import {
  CabinetExchangeSnapshot,
  ErrorCode,
  ExchangeDirection,
  ExchangeStatus,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { createCabinetExchangeComposition } from '../../composition/cabinet-exchange.composition';
import { i18n } from '../i18n/i18n';
import { CabinetExchangesPage } from './CabinetExchangesPage';

const draft: CabinetExchangeSnapshot = {
  id: 'ex-1',
  direction: ExchangeDirection.COMPANY_TO_CABINET,
  status: ExchangeStatus.DRAFT,
  category: 'Facture',
  document: { fileName: 'releve.pdf', mimeType: 'application/pdf', size: 2 },
  senderId: 'u1',
  date: '2026-10-06T09:00:00.000Z',
  consultedAt: null,
};
const ready = { ...draft, status: ExchangeStatus.TO_TRANSMIT };
const received = { ...draft, status: ExchangeStatus.RECEIVED };

const BASE = 'companies/c1/cabinet-exchanges';

function setup(
  listed: CabinetExchangeSnapshot[] | Error,
  opened: string[] = [],
) {
  const http = new InMemoryHttpClient();
  if (listed instanceof Error) {
    http.reject('get', BASE, listed);
  } else {
    http.reply('get', BASE, { status: 200, data: listed });
  }
  const deps = createCabinetExchangeComposition(
    http,
    new InMemorySessionGateway('jwt', {
      userId: 'u1',
      companyId: 'c1',
      role: UserRole.EMPLOYER,
    }),
  );
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={client}>
      <CabinetExchangesPage deps={deps} onOpen={(id) => opened.push(id)} />
    </QueryClientProvider>,
  );
  return http;
}

describe('CabinetExchangesPage', () => {
  it('shows a waiting state while the exchanges load', () => {
    setup([draft]);

    expect(screen.getByText(i18n.messages.loading)).toBeTruthy();
  });

  it('lists the exchanges once loaded', async () => {
    setup([draft]);

    expect(await screen.findByText('releve.pdf')).toBeTruthy();
    expect(
      screen.getByRole('heading', { name: i18n.messages.cabinet.title }),
    ).toBeTruthy();
  });

  it('tells why the exchanges cannot be shown', async () => {
    setup(new Error(ErrorCode.ACCESS_DENIED));

    expect(
      await screen.findByText(i18n.messages.errors.ACCESS_DENIED),
    ).toBeTruthy();
  });

  it('marks a draft as ready to transmit', async () => {
    const http = setup([draft]);
    http.reply('post', `${BASE}/ex-1/to-transmit`, { status: 201, data: ready });

    fireEvent.click(
      await screen.findByRole('button', {
        name: i18n.messages.cabinet.markToTransmit,
      }),
    );

    await waitFor(() =>
      expect(
        http.calls.some((call) => call.url === `${BASE}/ex-1/to-transmit`),
      ).toBe(true),
    );
  });

  it('transmits an exchange and confirms it', async () => {
    const http = setup([ready]);
    http.reply('post', `${BASE}/transmission`, { status: 201, data: [received] });

    fireEvent.click(
      await screen.findByRole('button', {
        name: i18n.messages.cabinet.transmit,
      }),
    );

    expect(
      await screen.findByText(i18n.messages.cabinet.transmitted),
    ).toBeTruthy();
    expect(
      http.calls.find((call) => call.url === `${BASE}/transmission`)?.data,
    ).toEqual({ exchangeIds: ['ex-1'] });
  });

  it('says so when the transmission fails, leaving the exchange ready to retry', async () => {
    const http = setup([ready]);
    http.reject(
      'post',
      `${BASE}/transmission`,
      new Error(ErrorCode.TRANSMISSION_FAILED),
    );

    fireEvent.click(
      await screen.findByRole('button', {
        name: i18n.messages.cabinet.transmit,
      }),
    );

    expect(
      await screen.findByText(i18n.messages.errors.TRANSMISSION_FAILED),
    ).toBeTruthy();
    expect(
      screen.getByRole('button', { name: i18n.messages.cabinet.transmit }),
    ).toBeTruthy();
  });

  it('creates a draft from the dialog', async () => {
    const http = setup([]);
    http.reply('post', BASE, { status: 201, data: draft });

    fireEvent.click(
      await screen.findByRole('button', {
        name: i18n.messages.cabinet.newDocument,
      }),
    );
    const dialog = within(screen.getByRole('dialog'));
    fireEvent.change(dialog.getByLabelText(i18n.messages.cabinet.category), {
      target: { value: 'Facture' },
    });
    fireEvent.change(dialog.getByLabelText(i18n.messages.cabinet.file), {
      target: {
        files: [
          new File([new Uint8Array([72, 105])], 'releve.pdf', {
            type: 'application/pdf',
          }),
        ],
      },
    });
    fireEvent.click(
      dialog.getByRole('button', { name: i18n.messages.cabinet.saveDraft }),
    );

    await waitFor(() =>
      expect(http.calls.find((call) => call.method === 'post')?.data).toEqual({
        category: 'Facture',
        file: {
          fileName: 'releve.pdf',
          mimeType: 'application/pdf',
          contentBase64: 'SGk=',
        },
      }),
    );
  });

  it('keeps the dialog open and says why when the file is refused', async () => {
    const http = setup([]);
    http.reject('post', BASE, new Error(ErrorCode.INVALID_FILE));

    fireEvent.click(
      await screen.findByRole('button', {
        name: i18n.messages.cabinet.newDocument,
      }),
    );
    const dialog = within(screen.getByRole('dialog'));
    fireEvent.change(dialog.getByLabelText(i18n.messages.cabinet.category), {
      target: { value: 'Facture' },
    });
    fireEvent.change(dialog.getByLabelText(i18n.messages.cabinet.file), {
      target: {
        files: [new File(['x'], 'releve.pdf', { type: 'application/pdf' })],
      },
    });
    fireEvent.click(
      dialog.getByRole('button', { name: i18n.messages.cabinet.saveDraft }),
    );

    expect(
      await within(screen.getByRole('dialog')).findByRole('alert'),
    ).toBeTruthy();
    expect(
      within(screen.getByRole('dialog')).getByRole('alert').textContent,
    ).toBe(i18n.messages.errors.INVALID_FILE);
  });

  it('opens a received exchange', async () => {
    const opened: string[] = [];
    setup([received], opened);

    fireEvent.click(
      await screen.findByRole('button', { name: i18n.messages.cabinet.open }),
    );

    expect(opened).toEqual(['ex-1']);
  });
});
