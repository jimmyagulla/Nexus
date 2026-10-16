import { ErrorCode } from '../errors/error-code';
import { DOCUMENT_COMMENT_MAX_LENGTH } from './document-limits';

export class DocumentComment {
  private constructor(readonly value: string) {}

  /** A blank comment is no comment. */
  static parse(raw: string | null | undefined): DocumentComment | null {
    const value = (raw ?? '').trim();
    if (value === '') {
      return null;
    }
    if (value.length > DOCUMENT_COMMENT_MAX_LENGTH) {
      throw new Error(ErrorCode.INVALID_INFORMATION);
    }
    return new DocumentComment(value);
  }
}
