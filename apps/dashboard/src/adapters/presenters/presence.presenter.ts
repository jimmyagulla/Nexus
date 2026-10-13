import {
  PresenceListSnapshot,
  PresenceSnapshot,
} from '@hexagonal-monorepo-template/domain';
import {
  i18n as appI18n,
  type I18n,
} from '../../infrastructure/ui/i18n/i18n';

export interface PresenceRowViewModel {
  id: string;
  employeeName: string;
  monthLabel: string;
  workedDays: number;
}

export interface EmployeeOptionViewModel {
  value: string;
  label: string;
}

export interface PresenceListViewModel {
  rows: PresenceRowViewModel[];
  employees: EmployeeOptionViewModel[];
  canManage: boolean;
}

export class PresencePresenter {
  constructor(private readonly i18n: I18n = appI18n) {}

  present(list: PresenceListSnapshot): PresenceListViewModel {
    return {
      rows: list.presences.map((presence) => this.presentRow(presence)),
      employees: list.employees.map((employee) => ({
        value: employee.id,
        label: employee.fullName,
      })),
      canManage: list.canManage,
    };
  }

  private presentRow(presence: PresenceSnapshot): PresenceRowViewModel {
    return {
      id: presence.id,
      employeeName: presence.employeeName,
      monthLabel: this.formatMonth(presence.month),
      workedDays: presence.workedDays,
    };
  }

  private formatMonth(month: string): string {
    const [year, number] = month.split('-') as [
      string,
      keyof I18n['messages']['months'],
    ];
    return `${this.i18n.messages.months[number]} ${year}`;
  }
}
