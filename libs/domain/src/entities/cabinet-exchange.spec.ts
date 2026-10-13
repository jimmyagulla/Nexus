import { ErrorCode } from '../errors/error-code';
import { ExchangeCategory } from '../value-objects/exchange-category';
import { ExchangeFile } from '../value-objects/exchange-file';
import { CabinetExchange } from './cabinet-exchange';
import { ExchangeDirection } from './exchange-direction';
import { ExchangeEventKind } from './exchange-event';
import { ExchangeStatus } from './exchange-status';

const created = new Date('2026-10-06T09:00:00.000Z');
const sent = new Date('2026-10-06T10:00:00.000Z');

function file(): ExchangeFile {
  return ExchangeFile.of('releve.pdf', 'application/pdf', new Uint8Array([1]));
}

function readyDraft(): CabinetExchange {
  return CabinetExchange.draft('ex-1', 'c1', 'user-1', created)
    .withCategory(ExchangeCategory.parse('Facture'))
    .withDocument(file());
}

describe('CabinetExchange', () => {
  it('starts as a draft going from the company to the cabinet', () => {
    const exchange = CabinetExchange.draft('ex-1', 'c1', 'user-1', created);

    expect(exchange).toMatchObject({
      id: 'ex-1',
      companyId: 'c1',
      senderId: 'user-1',
      direction: ExchangeDirection.COMPANY_TO_CABINET,
      status: ExchangeStatus.DRAFT,
      category: null,
      document: null,
      history: [],
    });
  });

  it('keeps the chosen category and the attached document', () => {
    const exchange = readyDraft();

    expect(exchange.category?.value).toBe('Facture');
    expect(exchange.document).toEqual({
      fileName: 'releve.pdf',
      mimeType: 'application/pdf',
      size: 1,
    });
  });

  it('becomes To transmit once the document and the category are chosen', () => {
    expect(readyDraft().markToTransmit().status).toBe(
      ExchangeStatus.TO_TRANSMIT,
    );
  });

  it('refuses To transmit without a document', () => {
    const draft = CabinetExchange.draft(
      'ex-1',
      'c1',
      'user-1',
      created,
    ).withCategory(ExchangeCategory.parse('Facture'));

    expect(() => draft.markToTransmit()).toThrow(ErrorCode.MISSING_DOCUMENT);
  });

  it('refuses To transmit without a category', () => {
    const draft = CabinetExchange.draft(
      'ex-1',
      'c1',
      'user-1',
      created,
    ).withDocument(file());

    expect(() => draft.markToTransmit()).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });

  it('is transmitted by its sender, who is remembered in the history', () => {
    const transmitted = readyDraft().markToTransmit().transmit('user-1', sent);

    expect(transmitted.status).toBe(ExchangeStatus.TRANSMITTED);
    expect(transmitted.history).toEqual([
      {
        kind: ExchangeEventKind.TRANSMITTED,
        actorId: 'user-1',
        occurredAt: sent,
        documentCount: 1,
      },
    ]);
  });

  it('remembers how many documents were transmitted together', () => {
    const transmitted = readyDraft()
      .markToTransmit()
      .transmit('user-1', sent, 5);

    expect(transmitted.history[0]?.documentCount).toBe(5);
  });

  it('becomes Received, automatically, once the recipient can see it', () => {
    const received = readyDraft()
      .markToTransmit()
      .transmit('user-1', sent)
      .receive(sent);

    expect(received.status).toBe(ExchangeStatus.RECEIVED);
    expect(received.history.map((event) => event.kind)).toEqual([
      ExchangeEventKind.TRANSMITTED,
      ExchangeEventKind.RECEIVED,
    ]);
    expect(received.history[1]?.actorId).toBeNull();
  });

  describe('opened by its recipient', () => {
    const consulted = new Date('2026-10-07T08:00:00.000Z');
    const later = new Date('2026-10-08T08:00:00.000Z');

    function received(): CabinetExchange {
      return readyDraft().markToTransmit().transmit('user-1', sent).receive(sent);
    }

    it('becomes Consulted on its first consultation', () => {
      const opened = received().consult('cab-1', consulted);

      expect(opened.status).toBe(ExchangeStatus.CONSULTED);
      expect(opened.history.at(-1)).toEqual({
        kind: ExchangeEventKind.CONSULTED,
        actorId: 'cab-1',
        occurredAt: consulted,
        documentCount: 1,
      });
    });

    it('remembers every later consultation without changing the status', () => {
      const opened = received().consult('cab-1', consulted).consult('cab-1', later);

      expect(opened.status).toBe(ExchangeStatus.CONSULTED);
      expect(
        opened.history.filter((event) => event.kind === ExchangeEventKind.CONSULTED),
      ).toHaveLength(2);
    });

    it('dates the consultation by the first one', () => {
      const opened = received().consult('cab-1', consulted).consult('cab-1', later);

      expect(opened.firstConsultedAt()).toEqual(consulted);
    });

    it('has no consultation date before it is opened', () => {
      expect(received().firstConsultedAt()).toBeNull();
    });

    it('is Consulted by a download too, which is remembered as such', () => {
      const downloaded = received().download('cab-1', consulted);

      expect(downloaded.status).toBe(ExchangeStatus.CONSULTED);
      expect(downloaded.history.at(-1)?.kind).toBe(ExchangeEventKind.DOWNLOADED);
    });

    it('keeps the first consultation date when a download comes after it', () => {
      const opened = received().consult('cab-1', consulted).download('cab-1', later);

      expect(opened.firstConsultedAt()).toEqual(consulted);
    });
  });
});
