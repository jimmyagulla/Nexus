import {
  DocumentFileFormat,
  documentFileFormatOfName,
} from '@hexagonal-monorepo-template/domain';
import {
  i18n as appI18n,
  type I18n,
} from '../../../infrastructure/ui/i18n/i18n';
import type { FileSizePresenter } from './file-size.presenter';

export interface UploadedFileModel {
  /** "1,2 Mo · Importé" */
  details: string;
  /** Remix Icon class of the file kind. */
  icon: string;
}

const FILE_ICONS: Record<DocumentFileFormat, string> = {
  PDF: 'ri-file-pdf-2-line',
  JPEG: 'ri-image-line',
  PNG: 'ri-image-line',
  XLS: 'ri-file-excel-2-line',
  XLSX: 'ri-file-excel-2-line',
  CSV: 'ri-file-excel-2-line',
};

/** Presents a file picked by the person, before it is sent. */
export class UploadedFilePresenter {
  constructor(
    private readonly sizes: FileSizePresenter,
    private readonly i18n: I18n = appI18n,
  ) {}

  present(file: { name: string; size: number }): UploadedFileModel {
    const format = documentFileFormatOfName(file.name);
    return {
      details: `${this.sizes.present(file.size)} · ${this.i18n.messages.documents.upload.imported}`,
      icon: format === null ? 'ri-file-line' : FILE_ICONS[format],
    };
  }
}
