export const ExchangeStatus = {
  DRAFT: 'DRAFT',
  TO_TRANSMIT: 'TO_TRANSMIT',
  TRANSMITTED: 'TRANSMITTED',
  RECEIVED: 'RECEIVED',
  CONSULTED: 'CONSULTED',
} as const;

export type ExchangeStatus =
  (typeof ExchangeStatus)[keyof typeof ExchangeStatus];
