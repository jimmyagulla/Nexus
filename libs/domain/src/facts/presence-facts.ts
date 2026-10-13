import { AbsenceFact } from './absence-fact';
import { HoursFact } from './hours-fact';
import { SickLeaveDocument } from './sick-leave-document';

export type PresenceFacts = {
  absences: readonly AbsenceFact[];
  sickLeaves: readonly SickLeaveDocument[];
  hours: readonly HoursFact[];
};
