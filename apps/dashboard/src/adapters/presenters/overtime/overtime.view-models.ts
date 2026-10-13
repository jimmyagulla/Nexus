/** View models of the overtime screens, produced by their presenters. */

import type { StatusViewModel } from '../display.view-models';

export interface OvertimeViewModel {
  counters: {
    pending: string;
    approved: string;
    processed: string;
  };
  declarations: OvertimeDeclarationRowModel[];
}

export interface OvertimeDeclarationViewModel {
  form: OvertimeDeclarationFormValues;
  counter: OvertimeCounterPanelModel;
  /** "Nadia Roussel, service RH" */
  validator: string;
}

export interface OvertimeCounterPanelModel {
  pending: string;
  thisDeclaration: string;
  pendingAfter: string;
}

export interface OvertimeDeclarationRowModel {
  date: string;
  /** "+2h30" */
  hours: string;
  reason: string;
  /** "1 fichier" or "—" */
  proof: string;
  status: StatusViewModel;
}

export interface OvertimeDeclarationFormValues {
  date: string;
  /** "2 h 30" */
  hours: string;
  startTime: string;
  endTime: string;
  reason: string;
}
