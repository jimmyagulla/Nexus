import { Document } from '../entities/document';
import { ErrorCode } from '../errors/error-code';
import { ActorContext } from '../identity/actor-context';

/**
 * An employee only reaches their own documents. A document of someone else
 * is refused exactly like a missing one, so that its existence never leaks.
 */
export function requireOwnedDocument(
  document: Document | null,
  actor: ActorContext,
): Document {
  if (document === null || !document.isOwnedBy(actor.companyId, actor.userId)) {
    throw new Error(ErrorCode.ACCESS_DENIED);
  }
  return document;
}

/** The scope of the documents an actor may list: their own, in their company. */
export function requireDocumentOwnerScope(actor: ActorContext): {
  companyId: string;
  ownerId: string;
} {
  if (actor.companyId === null) {
    throw new Error(ErrorCode.ACCESS_DENIED);
  }
  return { companyId: actor.companyId, ownerId: actor.userId };
}
