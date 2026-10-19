import { requireValid } from '../services/text-rules';
import { DOCUMENT_COMMENT_MAX_LENGTH } from './document-limits';

export class DocumentComment {
  private constructor(readonly value: string) {}

  /** A blank comment is no comment. */
  static parse(raw: string | null | undefined): DocumentComment | null {
    const value = (raw ?? '').trim();
    if (value === '') {
      return null;
    }
    return new DocumentComment(requireValid(value, value.length <= DOCUMENT_COMMENT_MAX_LENGTH));
  }
}
