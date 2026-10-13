import { ErrorCode } from '../errors/error-code';
import { ExchangeCategory } from '../value-objects/exchange-category';
import { ExchangeFile } from '../value-objects/exchange-file';
import { CabinetExchange } from './cabinet-exchange';
import { ExchangeStatus } from './exchange-status';
import {
  EXCHANGE_STATUS_TRANSITIONS,
  canTransition,
} from './exchange-status-transitions';

const at = new Date('2026-10-06T10:00:00.000Z');

function draft(): CabinetExchange {
  return CabinetExchange.draft('ex-1', 'c1', 'user-1', at)
    .withCategory(ExchangeCategory.parse('Facture'))
    .withDocument(
      ExchangeFile.of('a.pdf', 'application/pdf', new Uint8Array([1])),
    );
}

const IN_STATUS: Record<ExchangeStatus, () => CabinetExchange> = {
  [ExchangeStatus.DRAFT]: draft,
  [ExchangeStatus.TO_TRANSMIT]: () => draft().markToTransmit(),
  [ExchangeStatus.TRANSMITTED]: () =>
    draft().markToTransmit().transmit('user-1', at),
  [ExchangeStatus.RECEIVED]: () =>
    draft().markToTransmit().transmit('user-1', at).receive(at),
  [ExchangeStatus.CONSULTED]: () =>
    draft().markToTransmit().transmit('user-1', at).receive(at).consult('c', at),
};

const ACTIONS: Record<
  ExchangeStatus,
  { name: string; apply: (exchange: CabinetExchange) => CabinetExchange }
> = {
  [ExchangeStatus.DRAFT]: { name: 'draft', apply: (e) => e },
  [ExchangeStatus.TO_TRANSMIT]: {
    name: 'mark to transmit',
    apply: (exchange) => exchange.markToTransmit(),
  },
  [ExchangeStatus.TRANSMITTED]: {
    name: 'transmit',
    apply: (exchange) => exchange.transmit('user-1', at),
  },
  [ExchangeStatus.RECEIVED]: {
    name: 'receive',
    apply: (exchange) => exchange.receive(at),
  },
  [ExchangeStatus.CONSULTED]: {
    name: 'consult',
    apply: (exchange) => exchange.consult('cab-1', at),
  },
};

const STATUSES = Object.values(ExchangeStatus);

describe('exchange status transitions', () => {
  it('knows exactly the five statuses of the reference, no vault status', () => {
    expect(STATUSES).toEqual([
      'DRAFT',
      'TO_TRANSMIT',
      'TRANSMITTED',
      'RECEIVED',
      'CONSULTED',
    ]);
  });

  it('allows the four transitions of the reference and no other', () => {
    expect(EXCHANGE_STATUS_TRANSITIONS).toEqual([
      [ExchangeStatus.DRAFT, ExchangeStatus.TO_TRANSMIT],
      [ExchangeStatus.TO_TRANSMIT, ExchangeStatus.TRANSMITTED],
      [ExchangeStatus.TRANSMITTED, ExchangeStatus.RECEIVED],
      [ExchangeStatus.RECEIVED, ExchangeStatus.CONSULTED],
    ]);
  });

  it.each(
    STATUSES.flatMap((from) => STATUSES.map((to) => [from, to] as const)),
  )('answers whether %s may become %s as the reference does', (from, to) => {
    const allowed = EXCHANGE_STATUS_TRANSITIONS.some(
      ([source, target]) => source === from && target === to,
    );

    expect(canTransition(from, to)).toBe(allowed);
  });

  // Opening a Consulted exchange again is no transition: tested below.
  it.each(
    STATUSES.flatMap((from) =>
      STATUSES.filter((to) => to !== ExchangeStatus.DRAFT)
        .filter((to) => !(from === ExchangeStatus.CONSULTED && to === from))
        .map((to) => [from, to] as const),
    ),
  )('moves an exchange from %s to %s only along the reference', (from, to) => {
    const exchange = IN_STATUS[from]();
    const attempt = () => ACTIONS[to].apply(exchange);

    if (canTransition(from, to)) {
      expect(attempt().status).toBe(to);
    } else {
      expect(attempt).toThrow(ErrorCode.REQUEST_ALREADY_PROCESSED);
    }
  });

  it('keeps an exchange Consulted when it is consulted or downloaded again', () => {
    const consulted = IN_STATUS[ExchangeStatus.CONSULTED]();

    expect(consulted.consult('cab-1', at).status).toBe(ExchangeStatus.CONSULTED);
    expect(consulted.download('cab-1', at).status).toBe(
      ExchangeStatus.CONSULTED,
    );
  });

  it.each([
    ExchangeStatus.DRAFT,
    ExchangeStatus.TO_TRANSMIT,
    ExchangeStatus.TRANSMITTED,
  ])('cannot be consulted nor downloaded while %s', (status) => {
    const exchange = IN_STATUS[status]();

    expect(() => exchange.consult('cab-1', at)).toThrow(
      ErrorCode.REQUEST_ALREADY_PROCESSED,
    );
    expect(() => exchange.download('cab-1', at)).toThrow(
      ErrorCode.REQUEST_ALREADY_PROCESSED,
    );
  });

  it.each([
    ExchangeStatus.TO_TRANSMIT,
    ExchangeStatus.TRANSMITTED,
    ExchangeStatus.RECEIVED,
    ExchangeStatus.CONSULTED,
  ])('keeps its category and document once %s', (status) => {
    const exchange = IN_STATUS[status]();

    expect(() => exchange.withCategory(ExchangeCategory.parse('Autre'))).toThrow(
      ErrorCode.REQUEST_ALREADY_PROCESSED,
    );
    expect(() =>
      exchange.withDocument(
        ExchangeFile.of('b.pdf', 'application/pdf', new Uint8Array([2])),
      ),
    ).toThrow(ErrorCode.REQUEST_ALREADY_PROCESSED);
  });
});
