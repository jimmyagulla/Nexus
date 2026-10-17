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
import {
  CharacterCounterPresenter,
  type CharacterCounterLabel,
} from './character-counter.presenter';
import {
  DepositConfirmationPresenter,
  type DepositConfirmationMessage,
} from './deposit-confirmation.presenter';
import { DOCUMENT_CATEGORY_DISPLAY_ORDER } from './document-display';
import {
  DocumentTypeOptionPresenter,
  type DocumentTypeOptionModel,
} from './document-type-option.presenter';
import {
  UploadedFilePresenter,
  type UploadedFileModel,
} from './uploaded-file.presenter';

export type { DocumentTypeOptionModel } from './document-type-option.presenter';
export type { UploadedFileModel } from './uploaded-file.presenter';

export interface DocumentUploadViewModel {
  types: DocumentTypeOptionModel[];
  defaultType: DocumentCategory;
  /** `accept` attribute of the file inputs: extensions and media types. */
  accept: string;
  /** "PDF, JPG, PNG, XLS, XLSX, CSV · 10 Mo max." */
  dropzoneHint: string;
  nameMaxLength: number;
  commentMaxLength: number;
}

/**
 * Presents the document upload form. Each model has its own presenter; this
 * one assembles the form and hands the field-level models to the UI.
 */
export class DocumentUploadPresenter {
  private readonly types: DocumentTypeOptionPresenter;
  private readonly files: UploadedFilePresenter;
  private readonly counter: CharacterCounterPresenter;
  private readonly confirmation: DepositConfirmationPresenter;

  constructor(private readonly i18n: I18n = appI18n) {
    this.types = new DocumentTypeOptionPresenter(i18n);
    this.files = new UploadedFilePresenter(i18n);
    this.counter = new CharacterCounterPresenter(i18n);
    this.confirmation = new DepositConfirmationPresenter(i18n);
  }

  present(): DocumentUploadViewModel {
    return {
      types: DOCUMENT_CATEGORY_DISPLAY_ORDER.map((category) => this.types.present(category)),
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

  /** A file picked by the person, before it is sent. */
  presentFile(file: { name: string; size: number }): UploadedFileModel {
    return this.files.present(file);
  }

  presentCounter(length: number, max: number): CharacterCounterLabel {
    return this.counter.present(length, max);
  }

  presentDeposited(count: number): DepositConfirmationMessage {
    return this.confirmation.present(count);
  }

  private presentDropzoneHint(): string {
    const labels = this.i18n.messages.documents;
    const formats = DOCUMENT_FILE_FORMATS.map((spec) => labels.formats[spec.format]).join(', ');
    return labels.upload.dropzoneHint
      .replace('{formats}', formats)
      .replace('{size}', String(DOCUMENT_MAX_FILE_SIZE_BYTES / (1024 * 1024)));
  }
}
