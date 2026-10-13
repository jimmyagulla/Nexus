import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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
import { DepositDocumentPage } from './DepositDocumentPage';

const deposited: CabinetExchangeSnapshot = {
  id: 'ex-9',
  direction: ExchangeDirection.CABINET_TO_COMPANY,
  status: ExchangeStatus.RECEIVED,
  category: 'Bilan',
  document: { fileName: 'bilan.pdf', mimeType: 'application/pdf', size: 2 },
  senderId: 'cab-1',
  date: '2026-10-08T10:00:00.000Z',
  consultedAt: null,
};

const DEPOSIT = 'companies/c1/cabinet-exchanges/deposit';

function setup(refusal?: ErrorCode) {
  const http = new InMemoryHttpClient();
  if (refusal === undefined) {
    http.reply('post', DEPOSIT, { status: 201, data: deposited });
  } else {
    http.reject('post', DEPOSIT, new Error(refusal));
  }
  const deps = createCabinetExchangeComposition(
    http,
    new InMemorySessionGateway('jwt', {
      userId: 'cab-1',
      companyId: 'c1',
      role: UserRole.ACCOUNTANT,
    }),
  );
  render(
    <QueryClientProvider client={new QueryClient()}>
      <DepositDocumentPage deps={deps} />
    </QueryClientProvider>,
  );
  return http;
}

function fillAndDeposit() {
  fireEvent.change(screen.getByLabelText(i18n.messages.cabinet.category), {
    target: { value: 'Bilan' },
  });
  fireEvent.change(screen.getByLabelText(i18n.messages.cabinet.file), {
    target: {
      files: [
        new File([new Uint8Array([72, 105])], 'bilan.pdf', {
          type: 'application/pdf',
        }),
      ],
    },
  });
  fireEvent.click(
    screen.getByRole('button', { name: i18n.messages.cabinet.deposit }),
  );
}

describe('DepositDocumentPage', () => {
  it('deposits the document and confirms it', async () => {
    const http = setup();

    fillAndDeposit();

    expect(
      await screen.findByText(i18n.messages.cabinet.deposited),
    ).toBeTruthy();
    expect(http.calls[0]?.data).toEqual({
      category: 'Bilan',
      file: {
        fileName: 'bilan.pdf',
        mimeType: 'application/pdf',
        contentBase64: 'SGk=',
      },
    });
  });

  it('says why a revoked cabinet cannot deposit', async () => {
    setup(ErrorCode.ACCESS_DENIED);

    fillAndDeposit();

    expect(
      await screen.findByText(i18n.messages.errors.ACCESS_DENIED),
    ).toBeTruthy();
    await waitFor(() =>
      expect(screen.queryByText(i18n.messages.cabinet.deposited)).toBeNull(),
    );
  });
});
