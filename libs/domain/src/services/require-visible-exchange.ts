import { CabinetConnection } from '../entities/cabinet-connection';
import { CabinetExchange } from '../entities/cabinet-exchange';
import { ErrorCode } from '../errors/error-code';
import { ActorContext } from '../identity/actor-context';
import { isVisibleTo } from './exchange-visibility';

export async function requireVisibleExchange(
  exchangeId: string,
  actor: ActorContext,
  connection: CabinetConnection | null,
  findById: (id: string) => Promise<CabinetExchange | null>,
): Promise<CabinetExchange> {
  const exchange = await findById(exchangeId);
  if (exchange === null || !isVisibleTo(exchange, actor, connection)) {
    throw new Error(ErrorCode.INACCESSIBLE_DOCUMENT);
  }
  return exchange;
}
