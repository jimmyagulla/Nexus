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
 * Until its use case exists, the composition root hands it placeholder data,
 * which it returns as is.
 */
export class OvertimeDeclarationPresenter {
  constructor(private readonly placeholder: OvertimeDeclarationViewModel) {}

  present(): OvertimeDeclarationViewModel {
    return this.placeholder;
  }
}
