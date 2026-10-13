import { CabinetExchange } from '../entities/cabinet-exchange';
import { ExchangeDirection } from '../entities/exchange-direction';
import { ActorContext } from '../identity/actor-context';
import { UserRole } from '../identity/user-role';

const RECIPIENT_ROLE: Record<ExchangeDirection, UserRole> = {
  [ExchangeDirection.COMPANY_TO_CABINET]: UserRole.ACCOUNTANT,
  [ExchangeDirection.CABINET_TO_COMPANY]: UserRole.EMPLOYER,
};

const SENDER_ROLE: Record<ExchangeDirection, UserRole> = {
  [ExchangeDirection.COMPANY_TO_CABINET]: UserRole.EMPLOYER,
  [ExchangeDirection.CABINET_TO_COMPANY]: UserRole.ACCOUNTANT,
};

export function recipientRoleOf(exchange: CabinetExchange): UserRole {
  return RECIPIENT_ROLE[exchange.direction];
}

export function senderRoleOf(exchange: CabinetExchange): UserRole {
  return SENDER_ROLE[exchange.direction];
}

export function isRecipient(
  exchange: CabinetExchange,
  actor: ActorContext,
): boolean {
  return actor.role === recipientRoleOf(exchange);
}
