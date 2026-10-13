import { describe, expect, it } from 'vitest';
import {
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  CabinetExchangeSnapshot,
  ErrorCode,
  ExchangeDirection,
  ExchangeStatus,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { i18n } from '../ui/i18n/i18n';
import {
  CabinetExchangeComposition,
  createCabinetExchangeComposition,
} from './cabinet-exchange.composition';

const snapshot: CabinetExchangeSnapshot = {
  id: 'ex-1',
  direction: ExchangeDirection.COMPANY_TO_CABINET,
  status: ExchangeStatus.DRAFT,
  category: 'Facture',
  document: null,
  senderId: 'u1',
  date: '2026-10-06T09:00:00.000Z',
  consultedAt: null,
};

const employerOfAcme: ActorContext = {
  userId: 'u1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

const authorized = { headers: { Authorization: 'Bearer jwt' } };

function compositionFor(
  actor: ActorContext | null = employerOfAcme,
  token: string | null = 'jwt',
): { http: InMemoryHttpClient; deps: CabinetExchangeComposition } {
  const http = new InMemoryHttpClient();
  http.reply('post', 'companies/c1/cabinet-exchanges', {
    status: 201,
    data: snapshot,
  });
  http.reply('post', 'companies/c1/cabinet-exchanges/ex-1/to-transmit', {
    status: 201,
    data: snapshot,
  });
  http.reply('post', 'companies/c1/cabinet-exchanges/transmission', {
    status: 201,
    data: [snapshot],
  });
  http.reply('get', 'companies/c1/cabinet-exchanges', {
    status: 200,
    data: [snapshot],
  });
  http.reply('get', 'companies/c1/cabinet-exchanges/history', {
    status: 200,
    data: [],
  });
  http.reply('get', 'companies/c1/cabinet-exchanges/ex-1/history', {
    status: 200,
    data: [],
  });
  http.reply('post', 'companies/c1/cabinet-exchanges/deposit', {
    status: 201,
    data: snapshot,
  });
  http.reply('post', 'companies/c1/cabinet-exchanges/ex-1/consultation', {
    status: 201,
    data: snapshot,
  });
  http.reply('get', 'companies/c1/cabinet-exchanges/ex-1/file', {
    status: 200,
    data: {
      fileName: 'a.pdf',
      mimeType: 'application/pdf',
      contentBase64: 'SGk=',
    },
  });

  return {
    http,
    deps: createCabinetExchangeComposition(
      http,
      new InMemorySessionGateway(token, actor),
    ),
  };
}

describe('createCabinetExchangeComposition', () => {
  it('does not let its caller choose the api the http client targets', () => {
    expect(createCabinetExchangeComposition.length).toBe(2);
  });

  it('wires a controller that lists the exchanges of the session company', async () => {
    const { deps, http } = compositionFor();

    await expect(deps.controller.list()).resolves.toEqual([snapshot]);
    expect(http.calls).toEqual([
      {
        method: 'get',
        url: 'companies/c1/cabinet-exchanges',
        data: undefined,
        config: authorized,
      },
    ]);
  });

  it('wires a controller that creates a draft', async () => {
    const { deps, http } = compositionFor();

    await deps.controller.createDraft({ category: 'Facture' });

    expect(http.calls).toEqual([
      {
        method: 'post',
        url: 'companies/c1/cabinet-exchanges',
        data: { category: 'Facture', file: null },
        config: authorized,
      },
    ]);
  });

  it('wires a controller that marks an exchange as ready to transmit', async () => {
    const { deps, http } = compositionFor();

    await deps.controller.markToTransmit('ex-1');

    expect(http.calls[0]).toMatchObject({
      method: 'post',
      url: 'companies/c1/cabinet-exchanges/ex-1/to-transmit',
    });
  });

  it('wires a controller that transmits exchanges', async () => {
    const { deps, http } = compositionFor();

    await deps.controller.transmit(['ex-1']);

    expect(http.calls).toEqual([
      {
        method: 'post',
        url: 'companies/c1/cabinet-exchanges/transmission',
        data: { exchangeIds: ['ex-1'] },
        config: authorized,
      },
    ]);
  });

  it('provides the presenter the screen needs', () => {
    const { deps } = compositionFor();

    expect(deps.presenter.present([snapshot])).toMatchObject([
      { id: 'ex-1', status: 'Brouillon', date: '06/10/2026' },
    ]);
  });

  it('provides the error presenter the screen needs', () => {
    const { deps } = compositionFor();

    expect(
      deps.errorPresenter.present(new Error(ErrorCode.TRANSMISSION_FAILED)),
    ).toBe(i18n.messages.errors.TRANSMISSION_FAILED);
  });

  it('refuses to reach the api when the session carries no company', async () => {
    const { deps, http } = compositionFor({
      ...employerOfAcme,
      companyId: null,
    });

    await expect(deps.controller.list()).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
    expect(http.calls).toEqual([]);
  });

  it('refuses to reach the api when nobody is signed in', async () => {
    const { deps, http } = compositionFor(null, null);

    await expect(deps.controller.list()).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
    expect(http.calls).toEqual([]);
  });

  it('wires a controller that opens an exchange', async () => {
    const { deps, http } = compositionFor();

    await deps.controller.open('ex-1');

    expect(http.calls[0]).toMatchObject({
      method: 'post',
      url: 'companies/c1/cabinet-exchanges/ex-1/consultation',
    });
  });

  it('wires a controller that downloads the file of an exchange', async () => {
    const { deps } = compositionFor();

    await expect(deps.controller.download('ex-1')).resolves.toEqual({
      fileName: 'a.pdf',
      mimeType: 'application/pdf',
      content: new Uint8Array([72, 105]),
    });
  });

  it('wires a controller that deposits a document', async () => {
    const { deps, http } = compositionFor();

    await deps.controller.deposit({ category: 'Bilan', file: null });

    expect(http.calls).toEqual([
      {
        method: 'post',
        url: 'companies/c1/cabinet-exchanges/deposit',
        data: { category: 'Bilan', file: null },
        config: authorized,
      },
    ]);
  });

  it('wires a controller that reads the history of the exchanges', async () => {
    const { deps, http } = compositionFor();

    await deps.controller.history();
    await deps.controller.history('ex-1');

    expect(http.calls.map((call) => call.url)).toEqual([
      'companies/c1/cabinet-exchanges/history',
      'companies/c1/cabinet-exchanges/ex-1/history',
    ]);
  });

  it('provides the presenter that reads the history in french', () => {
    const { deps } = compositionFor();

    expect(
      deps.historyPresenter.present([
        {
          exchangeId: 'ex-1',
          kind: 'RECEIVED',
          actorRole: null,
          occurredAt: '2026-10-06T10:00:00.000Z',
          documentCount: 1,
          direction: 'COMPANY_TO_CABINET',
          fileName: 'a.pdf',
        },
      ]),
    ).toMatchObject([
      { phrase: 'Le document a été reçu par le cabinet comptable.' },
    ]);
  });

  it('wires a controller that asks for the filtered exchanges', async () => {
    const { deps, http } = compositionFor();
    http.reply(
      'get',
      'companies/c1/cabinet-exchanges?category=Facture&status=RECEIVED',
      { status: 200, data: [snapshot] },
    );

    await expect(
      deps.controller.list({ category: 'Facture', status: 'RECEIVED' }),
    ).resolves.toEqual([snapshot]);
  });
});
