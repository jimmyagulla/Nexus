import { DocumentSummary } from '@hexagonal-monorepo-template/domain';
import {
  i18n as appI18n,
  type I18n,
} from '../../../infrastructure/ui/i18n/i18n';
import type { StatusViewModel } from '../display.types';
import {
  DOCUMENT_CATEGORY_ICONS,
  DOCUMENT_STATUS_TONES,
} from './document-display';
import { FileSizePresenter } from './file-size.presenter';

export interface DocumentRowModel {
  id: string;
  /** Remix Icon class of the document kind, e.g. `ri-file-text-line`. */
  icon: string;
  name: string;
  category: string;
  date: string;
  format: string;
  size: string;
  emitter: string;
  status: StatusViewModel;
}

/** Presents one row of the documents list. */
export class DocumentRowPresenter {
  private readonly sizes: FileSizePresenter;

  constructor(private readonly i18n: I18n = appI18n) {
    this.sizes = new FileSizePresenter(i18n);
  }

  present(item: DocumentSummary): DocumentRowModel {
    const labels = this.i18n.messages.documents;
    return {
      id: item.id,
      icon: DOCUMENT_CATEGORY_ICONS[item.category],
      name: item.name,
      category: labels.categories[item.category],
      date: this.presentDate(new Date(item.createdAt)),
      format: labels.formats[item.format],
      size: this.sizes.present(item.sizeBytes),
      emitter: labels.emitters[item.emitter],
      status: { label: labels.statuses[item.status], tone: DOCUMENT_STATUS_TONES[item.status] },
    };
  }

  /** `jj/mm/aaaa`, in the time zone of the device. */
  private presentDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}/${date.getFullYear()}`;
  }
}
