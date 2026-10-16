import {
  ACCEPTED_DOCUMENT_EXTENSIONS,
  ACCEPTED_DOCUMENT_MIME_TYPES,
  DOCUMENT_COMMENT_MAX_LENGTH,
  DOCUMENT_FILE_FORMATS,
  DOCUMENT_MAX_FILE_SIZE_BYTES,
  DOCUMENT_NAME_MAX_LENGTH,
  DocumentCategory,
  DocumentFileFormat,
  documentFileFormatOfName,
} from '@hexagonal-monorepo-template/domain';
import {
  i18n as appI18n,
  type I18n,
} from '../../../infrastructure/ui/i18n/i18n';

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

export interface DocumentTypeOptionModel {
  value: DocumentCategory;
  /** Remix Icon class, e.g. `ri-first-aid-kit-line`. */
  icon: string;
  label: string;
  /** Label of the compact mobile chip ("Administratif"). */
  shortLabel: string;
  description: string;
  /** Reminder tied to the type, '' when there is none. */
  note: string;
  mobileNote: string;
}

export interface UploadedFileModel {
  /** "1,2 Mo · Importé" */
  details: string;
  /** Remix Icon class of the file kind. */
  icon: string;
}

/** Order of the type cards in the mockup. */
const TYPE_ORDER: readonly DocumentCategory[] = ['SICK_LEAVE', 'PROOF', 'ADMINISTRATIVE', 'OTHER'];

const TYPE_ICONS: Record<DocumentCategory, string> = {
  SICK_LEAVE: 'ri-first-aid-kit-line',
  PROOF: 'ri-file-check-line',
  ADMINISTRATIVE: 'ri-file-text-line',
  OTHER: 'ri-file-line',
};

const FILE_ICONS: Record<DocumentFileFormat, string> = {
  PDF: 'ri-file-pdf-2-line',
  JPEG: 'ri-image-line',
  PNG: 'ri-image-line',
  XLS: 'ri-file-excel-2-line',
  XLSX: 'ri-file-excel-2-line',
  CSV: 'ri-file-excel-2-line',
};

/** Presents the document upload form. */
export class DocumentUploadPresenter {
  constructor(private readonly i18n: I18n = appI18n) {}

  present(): DocumentUploadViewModel {
    return {
      types: TYPE_ORDER.map((category) => this.presentType(category)),
      defaultType: DocumentCategory.SICK_LEAVE,
      accept: [
        ...ACCEPTED_DOCUMENT_EXTENSIONS.map((extension) => `.${extension}`),
        ...ACCEPTED_DOCUMENT_MIME_TYPES,
      ].join(','),
      dropzoneHint: this.labels.upload.dropzoneHint
        .replace('{formats}', this.presentFormats())
        .replace('{size}', String(DOCUMENT_MAX_FILE_SIZE_BYTES / (1024 * 1024))),
      nameMaxLength: DOCUMENT_NAME_MAX_LENGTH,
      commentMaxLength: DOCUMENT_COMMENT_MAX_LENGTH,
    };
  }

  /** A file picked by the person, before it is sent. */
  presentFile(file: { name: string; size: number }): UploadedFileModel {
    const format = documentFileFormatOfName(file.name);
    return {
      details: `${this.presentSize(file.size)} · ${this.labels.upload.imported}`,
      icon: format === null ? 'ri-file-line' : FILE_ICONS[format],
    };
  }

  /** "12/250" */
  presentCounter(length: number, max: number): string {
    return this.labels.upload.counter
      .replace('{count}', String(length))
      .replace('{max}', String(max));
  }

  /** Confirmation once the documents are sent. */
  presentDeposited(count: number): string {
    return count === 1
      ? this.labels.upload.sentOne
      : this.labels.upload.sentOther.replace('{count}', String(count));
  }

  private get labels() {
    return this.i18n.messages.documents;
  }

  private presentType(category: DocumentCategory): DocumentTypeOptionModel {
    const type = this.labels.upload.types[category];
    return {
      value: category,
      icon: TYPE_ICONS[category],
      label: this.labels.categories[category],
      shortLabel: type.shortLabel,
      description: type.description,
      note: type.note,
      mobileNote: type.mobileNote,
    };
  }

  private presentFormats(): string {
    return DOCUMENT_FILE_FORMATS.map((spec) => this.labels.formats[spec.format]).join(', ');
  }

  /** "188 Ko", "1,4 Mo". */
  private presentSize(bytes: number): string {
    const sizes = this.labels.sizes;
    if (bytes < 1024) {
      return sizes.bytes.replace('{size}', String(bytes));
    }
    if (bytes < 1024 * 1024) {
      return sizes.kilobytes.replace('{size}', String(Math.round(bytes / 1024)));
    }
    const megabytes = (bytes / (1024 * 1024)).toFixed(1).replace('.0', '');
    return sizes.megabytes.replace('{size}', megabytes.replace('.', ','));
  }
}
