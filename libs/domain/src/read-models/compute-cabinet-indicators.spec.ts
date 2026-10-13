import { CabinetExchange } from '../entities/cabinet-exchange';
import { ExchangeCategory } from '../value-objects/exchange-category';
import { ExchangeFile } from '../value-objects/exchange-file';
import { computeCabinetIndicators } from './compute-cabinet-indicators';

const at = new Date('2026-10-06T10:00:00.000Z');
const file = ExchangeFile.of('a.pdf', 'application/pdf', new Uint8Array([1]));
const category = ExchangeCategory.parse('Facture');

function outgoing(id: string): CabinetExchange {
  return CabinetExchange.draft(id, 'c1', 'user-1', at)
    .withCategory(category)
    .withDocument(file);
}

function incoming(id: string): CabinetExchange {
  return CabinetExchange.deposit(id, 'c1', 'cab-1', category, file, at).receive(at);
}

describe('computeCabinetIndicators', () => {
  it('counts nothing when nothing was exchanged', () => {
    expect(computeCabinetIndicators([])).toEqual({
      toTransmit: 0,
      received: 0,
      notConsulted: 0,
    });
  });

  it('counts the exchanges To transmit', () => {
    const indicators = computeCabinetIndicators([
      outgoing('a').markToTransmit(),
      outgoing('b').markToTransmit(),
      outgoing('draft'),
      outgoing('c').markToTransmit().transmit('user-1', at).receive(at),
    ]);

    expect(indicators.toTransmit).toBe(2);
  });

  it('counts what the cabinet sent, Received or Consulted, as received', () => {
    const indicators = computeCabinetIndicators([
      incoming('a'),
      incoming('b').consult('user-1', at),
    ]);

    expect(indicators.received).toBe(2);
  });

  it('counts the received documents not consulted yet', () => {
    const indicators = computeCabinetIndicators([
      incoming('a'),
      incoming('b').consult('user-1', at),
    ]);

    expect(indicators.notConsulted).toBe(1);
  });

  it('does not count what the company sent to the cabinet as received', () => {
    const indicators = computeCabinetIndicators([
      outgoing('a').markToTransmit().transmit('user-1', at).receive(at),
    ]);

    expect(indicators).toEqual({ toTransmit: 0, received: 0, notConsulted: 0 });
  });
});
