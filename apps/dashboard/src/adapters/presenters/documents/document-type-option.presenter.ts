import { DocumentCategory } from '@hexagonal-monorepo-template/domain';
import {
  i18n as appI18n,
  type I18n,
} from '../../../infrastructure/ui/i18n/i18n';
import { DOCUMENT_CATEGORY_ICONS } from './document-display';

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

/** Presents one type card of the upload form. */
export class DocumentTypeOptionPresenter {
  constructor(private readonly i18n: I18n = appI18n) {}

  present(category: DocumentCategory): DocumentTypeOptionModel {
    const labels = this.i18n.messages.documents;
    const type = labels.upload.types[category];
    return {
      value: category,
      icon: DOCUMENT_CATEGORY_ICONS[category],
      label: labels.categories[category],
      shortLabel: type.shortLabel,
      description: type.description,
      note: type.note,
      mobileNote: type.mobileNote,
    };
  }
}
