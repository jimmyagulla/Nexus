import { DocumentCategory } from '../value-objects/document-category';
import { DocumentStatus } from '../value-objects/document-status';
import { DocumentSummary } from './document-summary';

/** A page of the documents list, with the counts the filters display. */
export type DocumentList = {
  items: readonly DocumentSummary[];
  /** Every document of the owner, whatever the criteria. */
  total: number;
  /** Documents of the owner per category, whatever the criteria. */
  categoryCounts: Readonly<Record<DocumentCategory, number>>;
  /** Documents of the owner per status, whatever the criteria. */
  statusCounts: Readonly<Record<DocumentStatus, number>>;
};

/** Link to the file of a document, valid for a short while. */
export type DocumentFileLink = {
  url: string;
  /** Name to save the file under, extension included. */
  fileName: string;
  contentType: string;
};
