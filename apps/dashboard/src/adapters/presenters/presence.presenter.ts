import {
  AbsenceEntrySnapshot,
  OvertimeEntrySnapshot,
  PresenceListSnapshot,
  PresenceSnapshot,
  SickLeaveEntrySnapshot,
  WorkedDaysAdjustmentSnapshot,
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
  originalWorkedDays: number;
  history: string[];
  leaves: string[];
  absences: string[];
  sickLeaves: string[];
  overtime: string[];
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
      originalWorkedDays: presence.proposedWorkedDays,
      history: presence.adjustments.map((entry) =>
        this.presentAdjustment(entry),
      ),
      leaves: presence.leaves.map((entry) => this.presentAbsence(entry)),
      absences: presence.absences.map((entry) => this.presentAbsence(entry)),
      sickLeaves: presence.sickLeaves.map((entry) =>
        this.presentSickLeave(entry),
      ),
      overtime: presence.overtime.map((entry) => this.presentOvertime(entry)),
    };
  }

  private presentAdjustment(entry: WorkedDaysAdjustmentSnapshot): string {
    const day = entry.occurredAt.slice(0, 10);
    return `${this.formatDate(day)} : ${entry.before} → ${entry.after}`;
  }

  private presentAbsence(entry: AbsenceEntrySnapshot): string {
    const period =
      entry.start === entry.end
        ? this.formatDate(entry.start)
        : `${this.formatDate(entry.start)} → ${this.formatDate(entry.end)}`;
    return `${entry.type} : ${period} (${entry.days} ${this.i18n.messages.presences.dayUnit})`;
  }

  private presentSickLeave(entry: SickLeaveEntrySnapshot): string {
    return this.formatDate(entry.date);
  }

  private presentOvertime(entry: OvertimeEntrySnapshot): string {
    const hours = String(entry.hours).replace(
      '.',
      this.i18n.messages.presences.decimalSeparator,
    );
    return `${this.formatDate(entry.date)} : ${hours} ${this.i18n.messages.presences.hourUnit}`;
  }

  private formatDate(isoDate: string): string {
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  }

  private formatMonth(month: string): string {
    const [year, number] = month.split('-') as [
      string,
      keyof I18n['messages']['months'],
    ];
    return `${this.i18n.messages.months[number]} ${year}`;
  }
}
