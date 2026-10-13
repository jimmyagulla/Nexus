import type { StatusViewModel } from '../display.types';

export interface OvertimeViewModel {
  counters: {
    pending: string;
    approved: string;
    processed: string;
  };
  declarations: OvertimeDeclarationRowModel[];
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

/**
 * Presents the overtime overview.
 * Until its use case exists, it receives placeholder data already shaped as
 * the view model, and returns it as is.
 */
export class OvertimePresenter {
  present(overtime: OvertimeViewModel): OvertimeViewModel {
    return overtime;
  }
}
