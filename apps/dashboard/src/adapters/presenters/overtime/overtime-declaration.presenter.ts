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

export interface OvertimeDeclarationFormValues {
  date: string;
  /** "2 h 30" */
  hours: string;
  startTime: string;
  endTime: string;
  reason: string;
}

/**
 * Presents the overtime declaration form.
 * Until its use case exists, it receives placeholder data already shaped as
 * the view model, and returns it as is.
 */
export class OvertimeDeclarationPresenter {
  present(overtimeDeclaration: OvertimeDeclarationViewModel): OvertimeDeclarationViewModel {
    return overtimeDeclaration;
  }
}
