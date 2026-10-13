export interface DocumentUploadViewModel {
  form: DocumentUploadFormModel;
  mobileForm: MobileDocumentUploadFormModel;
}

export interface DocumentTypeOptionModel {
  value: string;
  /** Remix Icon class, e.g. `ri-first-aid-kit-line`. */
  icon: string;
  label: string;
  /** Label of the compact mobile chip ("Administratif"). */
  shortLabel: string;
  description: string;
}

export interface DocumentUploadFormModel {
  types: DocumentTypeOptionModel[];
  selectedType: string;
  /** Reminder tied to the selected type. */
  note: string;
  file: { name: string; details: string };
  comment: string;
}

export interface MobileDocumentUploadFormModel {
  types: DocumentTypeOptionModel[];
  selectedType: string;
  note: string;
  file: { name: string; details: string };
}

/**
 * Presents the document upload form.
 * Until its use case exists, the composition root hands it placeholder data,
 * which it returns as is.
 */
export class DocumentUploadPresenter {
  constructor(private readonly placeholder: DocumentUploadViewModel) {}

  present(): DocumentUploadViewModel {
    return this.placeholder;
  }
}
