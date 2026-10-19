import { DocumentCategory } from '../value-objects/document-category';
import { DocumentComment } from '../value-objects/document-comment';
import { DocumentEmitter } from '../value-objects/document-emitter';
import {
  DocumentFileFormat,
  fileNameWithExtension,
} from '../value-objects/document-file-format';
import { DocumentName } from '../value-objects/document-name';
import { DocumentStatus } from '../value-objects/document-status';

export type DocumentProps = {
  id: string;
  companyId: string;
  /** The employee the document belongs to. */
  ownerId: string;
  /** The person who deposited it: the owner, or someone from HR. */
  uploadedById: string;
  name: DocumentName;
  category: DocumentCategory;
  status: DocumentStatus;
  format: DocumentFileFormat;
  sizeBytes: number;
  comment: DocumentComment | null;
  /** Key of the file in the document storage. */
  storageKey: string;
  createdAt: Date;
};

export class Document {
  constructor(private readonly props: DocumentProps) {}

  get id(): string {
    return this.props.id;
  }

  get companyId(): string {
    return this.props.companyId;
  }

  get ownerId(): string {
    return this.props.ownerId;
  }

  get uploadedById(): string {
    return this.props.uploadedById;
  }

  get name(): DocumentName {
    return this.props.name;
  }

  get category(): DocumentCategory {
    return this.props.category;
  }

  get status(): DocumentStatus {
    return this.props.status;
  }

  get format(): DocumentFileFormat {
    return this.props.format;
  }

  get sizeBytes(): number {
    return this.props.sizeBytes;
  }

  get comment(): DocumentComment | null {
    return this.props.comment;
  }

  get storageKey(): string {
    return this.props.storageKey;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  /** File name a download saves: the document name, with its extension. */
  get downloadName(): string {
    return fileNameWithExtension(this.props.name.value, this.props.format);
  }

  get emitter(): DocumentEmitter {
    return this.props.uploadedById === this.props.ownerId
      ? DocumentEmitter.SELF
      : DocumentEmitter.HR;
  }

  isOwnedBy(companyId: string | null, userId: string): boolean {
    return this.props.companyId === companyId && this.props.ownerId === userId;
  }

  /**
   * Viewing a document marks it as seen. A document already taken into
   * account keeps that status: viewing it again never sends it back.
   */
  view(): Document {
    if (
      this.props.status === DocumentStatus.SEEN ||
      this.props.status === DocumentStatus.PROCESSED
    ) {
      return this;
    }
    return new Document({ ...this.props, status: DocumentStatus.SEEN });
  }
}
