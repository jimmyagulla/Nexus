import {
  ActorContext,
  CabinetIndicators,
} from '@hexagonal-monorepo-template/domain';

export interface IGetCabinetIndicators {
  execute(input: {
    actor: ActorContext;
    companyId: string;
  }): Promise<CabinetIndicators>;
}

export const IGetCabinetIndicators = Symbol('IGetCabinetIndicators');
