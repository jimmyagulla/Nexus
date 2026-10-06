import {
  ActorContext,
  CompanySettingsSnapshot,
  DayOfWeek,
} from '@hexagonal-monorepo-template/domain';

export interface ISetNonWorkingWeekdays {
  execute(input: {
    actor: ActorContext;
    companyId: string;
    weekdays: readonly DayOfWeek[];
  }): Promise<CompanySettingsSnapshot>;
}

export const ISetNonWorkingWeekdays = Symbol('ISetNonWorkingWeekdays');
