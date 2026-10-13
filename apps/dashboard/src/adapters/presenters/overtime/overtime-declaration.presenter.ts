import type { OvertimeDeclarationViewModel } from './overtime.view-models';

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
