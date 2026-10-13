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
 * Until its use case exists, the composition root hands it placeholder data,
 * which it returns as is.
 */
export class OvertimePresenter {
  constructor(private readonly placeholder: OvertimeViewModel) {}

  present(): OvertimeViewModel {
    return this.placeholder;
  }
}
