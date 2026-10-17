import {
  ACCEPTED_DOCUMENT_EXTENSIONS,
  ACCEPTED_DOCUMENT_MIME_TYPES,
  DOCUMENT_COMMENT_MAX_LENGTH,
  DOCUMENT_FILE_FORMATS,
  DOCUMENT_MAX_FILE_SIZE_BYTES,
  DOCUMENT_NAME_MAX_LENGTH,
  DocumentCategory,
} from '@hexagonal-monorepo-template/domain';
import {
  i18n as appI18n,
  type I18n,
} from '../../../infrastructure/ui/i18n/i18n';

/** The constraints and wordings of the upload form; its type cards have their own presenter. */
export interface DocumentUploadViewModel {
  defaultType: DocumentCategory;
  /** `accept` attribute of the file inputs: extensions and media types. */
  accept: string;
  /** "PDF, JPG, PNG, XLS, XLSX, CSV · 10 Mo max." */
  dropzoneHint: string;
  nameMaxLength: number;
  commentMaxLength: number;
}

/** Presents the document upload form. */
export class DocumentUploadPresenter {
  constructor(private readonly i18n: I18n = appI18n) {}

  present(): DocumentUploadViewModel {
    return {
      defaultType: DocumentCategory.SICK_LEAVE,
      accept: [
        ...ACCEPTED_DOCUMENT_EXTENSIONS.map((extension) => `.${extension}`),
        ...ACCEPTED_DOCUMENT_MIME_TYPES,
      ].join(','),
      dropzoneHint: this.presentDropzoneHint(),
      nameMaxLength: DOCUMENT_NAME_MAX_LENGTH,
      commentMaxLength: DOCUMENT_COMMENT_MAX_LENGTH,
    };
  }

  private presentDropzoneHint(): string {
    const labels = this.i18n.messages.documents;
    const formats = DOCUMENT_FILE_FORMATS.map((spec) => labels.formats[spec.format]).join(', ');
    return labels.upload.dropzoneHint
      .replace('{formats}', formats)
      .replace('{size}', String(DOCUMENT_MAX_FILE_SIZE_BYTES / (1024 * 1024)));
  }
}
