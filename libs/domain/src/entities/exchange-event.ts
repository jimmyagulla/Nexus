export const ExchangeEventKind = {
  TRANSMITTED: 'TRANSMITTED',
  RECEIVED: 'RECEIVED',
  CONSULTED: 'CONSULTED',
  DOWNLOADED: 'DOWNLOADED',
} as const;

export type ExchangeEventKind =
  (typeof ExchangeEventKind)[keyof typeof ExchangeEventKind];

export type ExchangeEvent = {
  kind: ExchangeEventKind;
  actorId: string | null;
  occurredAt: Date;
  documentCount: number;
};
