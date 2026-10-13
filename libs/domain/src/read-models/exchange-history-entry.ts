import { ExchangeDirection } from '../entities/exchange-direction';
import { ExchangeEventKind } from '../entities/exchange-event';
import { UserRole } from '../identity/user-role';

export type ExchangeHistoryEntry = {
  exchangeId: string;
  kind: ExchangeEventKind;
  actorRole: UserRole | null;
  occurredAt: string;
  documentCount: number;
  direction: ExchangeDirection;
  fileName: string | null;
};
