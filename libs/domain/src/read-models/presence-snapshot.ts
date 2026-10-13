export type AbsenceEntrySnapshot = {
  id: string;
  type: string;
  start: string;
  end: string;
  days: number;
};

export type SickLeaveEntrySnapshot = {
  id: string;
  date: string;
};

export type OvertimeEntrySnapshot = {
  id: string;
  date: string;
  hours: number;
};

export type PresenceSnapshot = {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  workedDays: number;
  leaves: readonly AbsenceEntrySnapshot[];
  absences: readonly AbsenceEntrySnapshot[];
  sickLeaves: readonly SickLeaveEntrySnapshot[];
  overtime: readonly OvertimeEntrySnapshot[];
};
