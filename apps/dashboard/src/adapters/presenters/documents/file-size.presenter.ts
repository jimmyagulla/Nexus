import {
  i18n as appI18n,
  type I18n,
} from '../../../infrastructure/ui/i18n/i18n';

/** "188 Ko", "1,4 Mo". */
export type FileSizeLabel = string;

/** Presents a file size, for the list rows and the files picked for upload. */
export class FileSizePresenter {
  constructor(private readonly i18n: I18n = appI18n) {}

  present(bytes: number): FileSizeLabel {
    const sizes = this.i18n.messages.documents.sizes;
    if (bytes < 1024) {
      return sizes.bytes.replace('{size}', String(bytes));
    }
    if (bytes < 1024 * 1024) {
      return sizes.kilobytes.replace('{size}', String(Math.round(bytes / 1024)));
    }
    return sizes.megabytes.replace('{size}', this.presentMegabytes(bytes));
  }

  /** One decimal at most, with a decimal comma: "1,4". */
  private presentMegabytes(bytes: number): string {
    return (bytes / (1024 * 1024)).toFixed(1).replace('.0', '').replace('.', ',');
  }
}
