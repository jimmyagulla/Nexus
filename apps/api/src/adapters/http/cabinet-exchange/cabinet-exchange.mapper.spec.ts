import { describe, expect, it } from 'vitest';
import {
  CabinetExchangeSnapshot,
  ExchangeDirection,
  ExchangeStatus,
} from '@hexagonal-monorepo-template/domain';
import {
  toCabinetExchangeResponse,
  toExchangeFileInput,
} from './cabinet-exchange.mapper';

const snapshot: CabinetExchangeSnapshot = {
  id: 'ex-1',
  direction: ExchangeDirection.COMPANY_TO_CABINET,
  status: ExchangeStatus.RECEIVED,
  category: 'Facture',
  document: { fileName: 'a.pdf', mimeType: 'application/pdf', size: 2 },
  senderId: 'user-1',
  date: '2026-10-06T09:00:00.000Z',
};

describe('toCabinetExchangeResponse', () => {
  it('exposes the exchange as the API describes it', () => {
    expect(toCabinetExchangeResponse(snapshot)).toEqual(snapshot);
  });

  it('exposes an exchange without document', () => {
    expect(
      toCabinetExchangeResponse({ ...snapshot, document: null }).document,
    ).toBeNull();
  });
});

describe('toExchangeFileInput', () => {
  it('decodes the base64 content of the file', () => {
    expect(
      toExchangeFileInput({
        fileName: 'a.pdf',
        mimeType: 'application/pdf',
        contentBase64: 'SGk=',
      }),
    ).toEqual({
      fileName: 'a.pdf',
      mimeType: 'application/pdf',
      content: new Uint8Array([72, 105]),
    });
  });

  it('gives no file when none was sent', () => {
    expect(toExchangeFileInput(undefined)).toBeNull();
    expect(toExchangeFileInput(null)).toBeNull();
  });
});
