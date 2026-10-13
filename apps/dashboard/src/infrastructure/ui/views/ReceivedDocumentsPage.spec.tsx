import { fireEvent, render, screen } from '@testing-library/react';
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
import { ReceivedDocumentsPage } from './ReceivedDocumentsPage';

const received: CabinetExchangeSnapshot = {
  id: 'ex-1',
  direction: ExchangeDirection.COMPANY_TO_CABINET,
  status: ExchangeStatus.RECEIVED,
  category: 'Facture',
  document: { fileName: 'releve.pdf', mimeType: 'application/pdf', size: 2 },
  senderId: 'u1',
  date: '2026-10-06T09:00:00.000Z',
  consultedAt: null,
};

function setup(listed: CabinetExchangeSnapshot[] | Error, deposits: number[] = []) {
  const http = new InMemoryHttpClient();
  if (listed instanceof Error) {
    http.reject('get', 'companies/c1/cabinet-exchanges', listed);
  } else {
    http.reply('get', 'companies/c1/cabinet-exchanges', {
      status: 200,
      data: listed,
    });
  }
  const deps = createCabinetExchangeComposition(
    http,
    new InMemorySessionGateway('jwt', {
      userId: 'cab-1',
      companyId: 'c1',
      role: UserRole.ACCOUNTANT,
    }),
  );
  const opened: string[] = [];
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <ReceivedDocumentsPage
        deps={deps}
        onOpen={(id) => opened.push(id)}
        onDeposit={() => deposits.push(1)}
      />
    </QueryClientProvider>,
  );
  return { opened, http };
}

describe('ReceivedDocumentsPage', () => {
  it('shows a waiting state while the documents load', () => {
    setup([received]);

    expect(screen.getByText(i18n.messages.loading)).toBeTruthy();
  });

  it('lists the documents the cabinet received', async () => {
    setup([received]);

    expect(await screen.findByText('releve.pdf')).toBeTruthy();
  });

  it('tells why the documents cannot be shown', async () => {
    setup(new Error(ErrorCode.ACCESS_DENIED));

    expect(
      await screen.findByText(i18n.messages.errors.ACCESS_DENIED),
    ).toBeTruthy();
  });

  it('opens a document', async () => {
    const { opened } = setup([received]);

    fireEvent.click(
      await screen.findByRole('button', { name: i18n.messages.cabinet.open }),
    );

    expect(opened).toEqual(['ex-1']);
  });

  it('says that nothing was exchanged yet, and offers to deposit a document', async () => {
    const deposits: number[] = [];
    setup([], deposits);

    expect(
      await screen.findByText(i18n.messages.cabinet.emptyList),
    ).toBeTruthy();
    fireEvent.click(
      screen.getByRole('button', {
        name: i18n.messages.cabinet.depositAction,
      }),
    );

    expect(deposits).toEqual([1]);
  });

  it('asks the api for the filtered documents', async () => {
    const { http } = setup([received]);
    http.reply('get', 'companies/c1/cabinet-exchanges?status=CONSULTED', {
      status: 200,
      data: [],
    });
    await screen.findByText('releve.pdf');

    fireEvent.change(
      screen.getByLabelText(i18n.messages.cabinet.filters.status),
      { target: { value: 'CONSULTED' } },
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: i18n.messages.cabinet.filters.apply,
      }),
    );

    expect(
      await screen.findByText(i18n.messages.cabinet.noMatch),
    ).toBeTruthy();
  });
});
