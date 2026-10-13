import { ExchangeDirection } from '../entities/exchange-direction';
import { ExchangeStatus } from '../entities/exchange-status';
import { ExchangeDocument } from '../value-objects/exchange-file';

export type CabinetExchangeSnapshot = {
  id: string;
  direction: ExchangeDirection;
  status: ExchangeStatus;
  category: string | null;
  document: ExchangeDocument | null;
  senderId: string;
  date: string;
};
