import {
  ActorContext,
  CabinetIndicators,
  computeCabinetIndicators,
  isVisibleTo,
  requireCompanyEmployer,
} from '@hexagonal-monorepo-template/domain';
import {
  ICabinetExchangeRepository,
  IGetCabinetIndicators,
} from '@hexagonal-monorepo-template/ports';

export class GetCabinetIndicatorsUseCase implements IGetCabinetIndicators {
  constructor(private readonly exchanges: ICabinetExchangeRepository) {}

  async execute(input: {
    actor: ActorContext;
    companyId: string;
  }): Promise<CabinetIndicators> {
    requireCompanyEmployer(input.actor, input.companyId);
    const all = await this.exchanges.listByCompany(input.companyId);
    return computeCabinetIndicators(
      all.filter((exchange) => isVisibleTo(exchange, input.actor, null)),
    );
  }
}
