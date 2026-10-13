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
 * Until its use case exists, it receives placeholder data already shaped as
 * the view model, and returns it as is.
 */
export class DocumentUploadPresenter {
  present(documentUpload: DocumentUploadViewModel): DocumentUploadViewModel {
    return documentUpload;
  }
}
