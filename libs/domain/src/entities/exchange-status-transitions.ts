import { ExchangeStatus } from './exchange-status';

export const EXCHANGE_STATUS_TRANSITIONS: readonly (readonly [
  ExchangeStatus,
  ExchangeStatus,
])[] = [
  [ExchangeStatus.DRAFT, ExchangeStatus.TO_TRANSMIT],
  [ExchangeStatus.TO_TRANSMIT, ExchangeStatus.TRANSMITTED],
  [ExchangeStatus.TRANSMITTED, ExchangeStatus.RECEIVED],
  [ExchangeStatus.RECEIVED, ExchangeStatus.CONSULTED],
];

export function canTransition(from: ExchangeStatus, to: ExchangeStatus): boolean {
  return EXCHANGE_STATUS_TRANSITIONS.some(
    ([source, target]) => source === from && target === to,
  );
}
